/**
 * Mini Tokyo 3D MapLibre Compatibility Patch
 *
 * Fixes the 24-second freeze during zoom/pan operations by throttling
 * event handlers that trigger expensive deck.gl layer updates.
 *
 * Load this script BEFORE mini-tokyo-3d.min.js
 */

(function() {
    'use strict';

    if (window.debugPanel) {
        window.debugPanel.log('INFO', '🔧 Loading Mini Tokyo 3D MapLibre compatibility patch');
    }

    /**
     * Throttle function - limits how often a function can execute
     * @param {Function} func - Function to throttle
     * @param {number} wait - Milliseconds to wait between executions
     * @returns {Function} Throttled function
     */
    function throttle(func, wait) {
        let timeout;
        let lastRan;
        let lastContext;
        let lastArgs;

        return function executedFunction(...args) {
            const context = this;

            if (!lastRan) {
                // First call - execute immediately
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                // Subsequent calls - throttle
                lastContext = context;
                lastArgs = args;

                clearTimeout(timeout);

                const timeSinceLastRan = Date.now() - lastRan;
                const timeToWait = Math.max(wait - timeSinceLastRan, 0);

                timeout = setTimeout(function() {
                    func.apply(lastContext, lastArgs);
                    lastRan = Date.now();
                }, timeToWait);
            }
        };
    }

    /**
     * Debounce function - delays execution until after calls have stopped
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait after last call
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Store original mt3d once it loads
    const originalMT3DInit = () => {
        if (!window.mt3d || !window.mt3d.Map) {
            // MT3D not loaded yet, wait
            return false;
        }

        if (window.debugPanel) {
            window.debugPanel.log('INFO', '✅ Mini Tokyo 3D detected, applying patches');
        }

        const OriginalMap = window.mt3d.Map;

        // Create patched Map class
        window.mt3d.Map = function(options) {
            if (window.debugPanel) {
                window.debugPanel.log('INFO', '🎯 Initializing patched Mini Tokyo 3D Map');
            }

            // Call original constructor
            const mapInstance = new OriginalMap(options);

            // Wrap the getMapboxMap method to ensure it returns the underlying map
            const originalGetMapboxMap = mapInstance.getMapboxMap;
            if (originalGetMapboxMap) {
                mapInstance.getMapboxMap = function() {
                    const underlyingMap = originalGetMapboxMap.call(this);

                    // Patch the underlying map's event system
                    if (underlyingMap && !underlyingMap._mt3dPatched) {
                        underlyingMap._mt3dPatched = true;

                        const originalOn = underlyingMap.on.bind(underlyingMap);
                        const throttledHandlers = new Map();

                        underlyingMap.on = function(event, layerIdOrHandler, handler) {
                            // Handle both .on(event, handler) and .on(event, layerId, handler)
                            const actualHandler = handler || layerIdOrHandler;
                            const layerId = handler ? layerIdOrHandler : undefined;

                            if (typeof actualHandler !== 'function') {
                                // Not a handler, pass through
                                return originalOn(event, layerIdOrHandler, handler);
                            }

                            // Throttle expensive events
                            if (event === 'zoom' || event === 'move' || event === 'rotate' || event === 'pitch') {
                                const handlerKey = `${event}_${actualHandler.toString().substring(0, 50)}`;

                                if (!throttledHandlers.has(handlerKey)) {
                                    // Throttle to 250ms (4 updates/second max)
                                    const throttledHandler = throttle(actualHandler, 250);
                                    throttledHandlers.set(handlerKey, throttledHandler);

                                    if (window.debugPanel) {
                                        window.debugPanel.log('DEBUG', `⏱️ Throttling ${event} handler (250ms)`,  {
                                            event,
                                            originalHandler: actualHandler.name || 'anonymous'
                                        });
                                    }
                                }

                                const wrappedHandler = throttledHandlers.get(handlerKey);
                                return layerId
                                    ? originalOn(event, layerId, wrappedHandler)
                                    : originalOn(event, wrappedHandler);
                            }

                            // Don't throttle other events
                            return layerId
                                ? originalOn(event, layerId, actualHandler)
                                : originalOn(event, actualHandler);
                        };

                        if (window.debugPanel) {
                            window.debugPanel.log('INFO', '✅ Patched underlying map event system');
                        }
                    }

                    return underlyingMap;
                };
            }

            // Also patch direct event listeners on the MT3D map instance
            const originalMapOn = mapInstance.on;
            if (originalMapOn) {
                const mapThrottledHandlers = new Map();

                mapInstance.on = function(event, handler) {
                    if (typeof handler !== 'function') {
                        return originalMapOn.call(this, event, handler);
                    }

                    // Throttle expensive events
                    if (event === 'zoom' || event === 'move' || event === 'rotate' || event === 'pitch') {
                        const handlerKey = `${event}_${handler.toString().substring(0, 50)}`;

                        if (!mapThrottledHandlers.has(handlerKey)) {
                            const throttledHandler = throttle(handler, 250);
                            mapThrottledHandlers.set(handlerKey, throttledHandler);

                            if (window.debugPanel) {
                                window.debugPanel.log('DEBUG', `⏱️ Throttling MT3D ${event} handler (250ms)`, {
                                    event,
                                    handlerName: handler.name || 'anonymous'
                                });
                            }
                        }

                        return originalMapOn.call(this, event, mapThrottledHandlers.get(handlerKey));
                    }

                    return originalMapOn.call(this, event, handler);
                };
            }

            if (window.debugPanel) {
                window.debugPanel.log('INFO', '✅ Mini Tokyo 3D Map patching complete');
            }

            return mapInstance;
        };

        // Copy static methods/properties from original
        Object.setPrototypeOf(window.mt3d.Map, OriginalMap);
        Object.setPrototypeOf(window.mt3d.Map.prototype, OriginalMap.prototype);

        if (window.debugPanel) {
            window.debugPanel.log('INFO', '🎉 Mini Tokyo 3D MapLibre patch applied successfully', {
                throttleDelay: '250ms',
                eventsThrottled: ['zoom', 'move', 'rotate', 'pitch']
            });
        }

        return true;
    };

    // Try to patch immediately if MT3D is already loaded
    if (!originalMT3DInit()) {
        // MT3D not loaded yet, wait for it
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds
        const checkInterval = setInterval(() => {
            attempts++;
            if (originalMT3DInit()) {
                clearInterval(checkInterval);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (window.debugPanel) {
                    window.debugPanel.log('ERROR', '❌ Mini Tokyo 3D not found after 5 seconds - patch not applied');
                }
                console.error('[MT3D Patch] Mini Tokyo 3D not detected after 5 seconds');
            }
        }, 100);
    }

})();
