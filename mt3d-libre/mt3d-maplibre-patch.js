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

    // Patch Mini Tokyo 3D as soon as it's defined
    const patchMT3D = (mt3d) => {
        if (!mt3d || !mt3d.Map) {
            return false;
        }

        if (window.debugPanel) {
            window.debugPanel.log('INFO', '✅ Mini Tokyo 3D detected, applying patches');
        }

        const OriginalMap = mt3d.Map;

        // Patch getMapboxMap on the PROTOTYPE before any instances are created
        // This ensures the patch is active during MT3D Map construction
        const OriginalGetMapboxMap = OriginalMap.prototype.getMapboxMap;
        const throttledHandlersMap = new WeakMap(); // Store throttled handlers per map instance

        if (OriginalGetMapboxMap) {
            OriginalMap.prototype.getMapboxMap = function() {
                const underlyingMap = OriginalGetMapboxMap.call(this);

                // Patch the underlying map's event system (once per map)
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
                                    window.debugPanel.log('DEBUG', `⏱️ Throttling ${event} handler (250ms)`, {
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

            if (window.debugPanel) {
                window.debugPanel.log('INFO', '✅ Patched getMapboxMap() on prototype - will intercept during construction');
            }
        }

        // Create wrapper class that also patches direct MT3D map event listeners
        mt3d.Map = function(options) {
            if (window.debugPanel) {
                window.debugPanel.log('INFO', '🎯 Initializing patched Mini Tokyo 3D Map');
            }

            // Call original constructor (prototype patch is already active)
            const mapInstance = new OriginalMap(options);

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
        Object.setPrototypeOf(mt3d.Map, OriginalMap);
        Object.setPrototypeOf(mt3d.Map.prototype, OriginalMap.prototype);

        if (window.debugPanel) {
            window.debugPanel.log('INFO', '🎉 Mini Tokyo 3D MapLibre patch applied successfully', {
                throttleDelay: '250ms',
                eventsThrottled: ['zoom', 'move', 'rotate', 'pitch']
            });
        }

        return true;
    };

    // Use a property trap to patch synchronously when mt3d is defined
    // This ensures we patch BEFORE any code can call new mt3d.Map()
    let _mt3d;
    let patched = false;

    // Check if mt3d already exists (in case this script loads after mini-tokyo-3d.min.js)
    if (window.mt3d) {
        patchMT3D(window.mt3d);
        patched = true;
    } else {
        // Set up trap to catch when mt3d is defined
        Object.defineProperty(window, 'mt3d', {
            configurable: true,
            enumerable: true,
            get() {
                return _mt3d;
            },
            set(value) {
                _mt3d = value;
                if (!patched && value && value.Map) {
                    patchMT3D(value);
                    patched = true;
                }
            }
        });

        console.log('[MT3D Patch] Property trap installed - will patch when mini-tokyo-3d.min.js loads');
    }

})();
