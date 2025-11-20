/**
 * MT3D ScrollZoom Fix v4 - Final Solution
 *
 * ROOT CAUSE (confirmed via debug logs):
 * When user scrolls to zoom, something in MapLibre/MT3D fires zoomstart and zoom
 * events BEFORE scrollZoom._active becomes true. This creates a race condition:
 *
 * Timeline (from debug logs):
 * 1. Canvas wheel event #1 (scrollZoomActive: false)
 * 2. map.fire('zoomstart') fires (scrollZoomActive: false) ❌ WRONG!
 * 3. map.fire('zoom') fires (scrollZoomActive: false) ❌ WRONG!
 * 4. ScrollZoom activates (scrollZoomActive: true) - too late
 * 5. Subsequent wheel events can't complete zoom - broken state
 *
 * THE FIX:
 * Intercept map.fire() and BLOCK zoomstart/zoom events from wheel events
 * when scrollZoom isn't active yet. This forces zoom to wait for scrollZoom
 * to properly activate, preventing the race condition.
 *
 * Stack trace showed events fired from: Tr._fireEvent / Tr._fireEvents
 * (internal MapLibre methods called from MT3D code)
 */

(function() {
    'use strict';

    console.log('[MT3D ScrollZoom Fix v4] Initializing...');

    // Wait for MT3D to initialize
    const originalMt3dMap = window.mt3d?.Map;
    if (!originalMt3dMap) {
        console.warn('[MT3D ScrollZoom Fix v4] mt3d.Map not found, will try after DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyFix, 100);
        });
        return;
    }

    applyFix();

    function applyFix() {
        if (!window.mt3d?.Map) {
            console.warn('[MT3D ScrollZoom Fix v4] mt3d.Map still not found');
            return;
        }

        // Intercept MT3D Map initialization
        const OriginalMap = window.mt3d.Map;

        window.mt3d.Map = function(options) {
            const instance = new OriginalMap(options);

            // Wait for map to be ready
            instance.once('initialized', () => {
                console.log('[MT3D ScrollZoom Fix v4] Applying patches...');

                // Get the underlying MapLibre map
                const map = instance.getMapboxMap ? instance.getMapboxMap() :
                           (instance.getMap ? instance.getMap() : null);

                if (!map) {
                    console.warn('[MT3D ScrollZoom Fix v4] Could not access underlying map');
                    return;
                }

                // Track scrollZoom state for debugging
                let lastScrollZoomActive = false;
                const checkScrollZoomState = () => {
                    const currentActive = map.scrollZoom?._active || false;
                    if (currentActive !== lastScrollZoomActive) {
                        if (window.debugPanel) {
                            window.debugPanel.log('DEBUG', `🔄 scrollZoom._active changed: ${lastScrollZoomActive} → ${currentActive}`, {
                                stack: new Error().stack.split('\n').slice(2, 5).join('\n')
                            });
                        }
                        lastScrollZoomActive = currentActive;
                    }
                };

                // Monitor scrollZoom._active changes via setInterval
                setInterval(checkScrollZoomState, 10);

                // Intercept scrollZoom.disable() and enable() to see if it's being manipulated
                const originalScrollZoomDisable = map.scrollZoom.disable;
                map.scrollZoom.disable = function(...args) {
                    if (window.debugPanel) {
                        window.debugPanel.log('WARN', '⚠️ scrollZoom.disable() called', {
                            scrollZoomActive: map.scrollZoom._active,
                            stack: new Error().stack.split('\n').slice(2, 4).join(' | ')
                        });
                    }
                    return originalScrollZoomDisable.apply(this, args);
                };

                const originalScrollZoomEnable = map.scrollZoom.enable;
                map.scrollZoom.enable = function(...args) {
                    if (window.debugPanel) {
                        window.debugPanel.log('DEBUG', '✅ scrollZoom.enable() called', {
                            scrollZoomActive: map.scrollZoom._active,
                            stack: new Error().stack.split('\n').slice(2, 4).join(' | ')
                        });
                    }
                    return originalScrollZoomEnable.apply(this, args);
                };

                // Intercept map.fire() to prevent broken zoom state
                const originalFire = map.fire;
                map.fire = function(event, ...args) {
                    const eventType = typeof event === 'string' ? event : event.type;

                    if (eventType && eventType.includes('zoom')) {
                        const scrollZoomActive = map.scrollZoom?._active || false;
                        const isWheelEvent = event?.originalEvent?.type === 'wheel';

                        if (window.debugPanel) {
                            window.debugPanel.log('DEBUG', `🔥 map.fire('${eventType}')`, {
                                scrollZoomActive,
                                _zooming: map._zooming,
                                isWheelEvent,
                                stack: new Error().stack.split('\n').slice(2, 4).join(' | ')
                            });
                        }

                        // CRITICAL FIX: Prevent zoom events from wheel when scrollZoom isn't active
                        // This fixes the race condition where zoom events fire before scrollZoom activates
                        if (isWheelEvent && !scrollZoomActive && (eventType === 'zoomstart' || eventType === 'zoom')) {
                            if (window.debugPanel) {
                                window.debugPanel.log('WARN', `🛡️ Blocked ${eventType} event - scrollZoom not active yet`, {
                                    eventType,
                                    scrollZoomActive,
                                    willRetryWhenActive: 'scrollZoom will fire its own events when ready'
                                });
                            }
                            // Don't fire this event - let scrollZoom fire it when it's ready
                            return this;
                        }
                    }

                    return originalFire.call(this, event, ...args);
                };

                // Intercept zoom-triggering methods
                const originalJumpTo = map.jumpTo;
                map.jumpTo = function(...args) {
                    const scrollZoomActive = map.scrollZoom?._active || false;

                    if (window.debugPanel) {
                        window.debugPanel.log('DEBUG', '🎯 map.jumpTo() called', {
                            scrollZoomActive,
                            _zooming: map._zooming,
                            args: args.length > 0 ? JSON.stringify(args[0]).substring(0, 100) : 'none'
                        });
                    }

                    // If scrollZoom is active, prevent jumpTo to avoid disruption
                    if (scrollZoomActive) {
                        if (window.debugPanel) {
                            window.debugPanel.log('WARN', '🛡️ Prevented map.jumpTo() during active scroll zoom');
                        }
                        return;
                    }

                    return originalJumpTo.apply(this, args);
                };

                const originalEaseTo = map.easeTo;
                map.easeTo = function(...args) {
                    const scrollZoomActive = map.scrollZoom?._active || false;

                    if (window.debugPanel) {
                        window.debugPanel.log('DEBUG', '🎯 map.easeTo() called', {
                            scrollZoomActive,
                            _zooming: map._zooming,
                            args: args.length > 0 ? JSON.stringify(args[0]).substring(0, 100) : 'none'
                        });
                    }

                    if (scrollZoomActive) {
                        if (window.debugPanel) {
                            window.debugPanel.log('WARN', '🛡️ Prevented map.easeTo() during active scroll zoom');
                        }
                        return;
                    }

                    return originalEaseTo.apply(this, args);
                };

                const originalFlyTo = map.flyTo;
                map.flyTo = function(...args) {
                    const scrollZoomActive = map.scrollZoom?._active || false;

                    if (window.debugPanel) {
                        window.debugPanel.log('DEBUG', '🎯 map.flyTo() called', {
                            scrollZoomActive,
                            _zooming: map._zooming,
                            args: args.length > 0 ? JSON.stringify(args[0]).substring(0, 100) : 'none'
                        });
                    }

                    if (scrollZoomActive) {
                        if (window.debugPanel) {
                            window.debugPanel.log('WARN', '🛡️ Prevented map.flyTo() during active scroll zoom');
                        }
                        return;
                    }

                    return originalFlyTo.apply(this, args);
                };

                // Store original _jumpTo
                const original_jumpTo = instance._jumpTo;
                if (typeof original_jumpTo !== 'function') {
                    console.warn('[MT3D ScrollZoom Fix v4] _jumpTo method not found');
                    return;
                }

                // Replace _jumpTo with patched version
                instance._jumpTo = function(options) {
                    const scrollZoomActive = map.scrollZoom?._active || false;

                    if (window.debugPanel) {
                        window.debugPanel.log('DEBUG', '🎯 MT3D._jumpTo() called', {
                            scrollZoomActive,
                            _zooming: map._zooming,
                            trackedObject: this.trackedObject ? this.trackedObject.type : 'none'
                        });
                    }

                    // Check if scroll zoom is active
                    if (scrollZoomActive) {
                        // Skip _jumpTo during active scroll zoom to prevent interference
                        if (window.debugPanel) {
                            window.debugPanel.log('WARN', '🛡️ Prevented MT3D._jumpTo() during active scroll zoom');
                        }
                        return;
                    }

                    // Call original _jumpTo
                    return original_jumpTo.call(this, options);
                };

                console.log('[MT3D ScrollZoom Fix v4] Successfully patched all zoom-related methods');

                if (window.debugPanel) {
                    window.debugPanel.log('INFO', '✅ MT3D ScrollZoom Fix v4 applied', {
                        fix: 'Blocks premature zoomstart/zoom events from wheel when scrollZoom inactive',
                        intercepted: 'map.fire(), jumpTo, easeTo, flyTo, _jumpTo, scrollZoom.enable/disable',
                        monitoring: 'scrollZoom._active state changes every 10ms',
                        diagnostic: 'All zoom-related calls logged with stack traces'
                    });
                }
            });

            return instance;
        };

        // Copy static properties
        Object.setPrototypeOf(window.mt3d.Map, OriginalMap);
        for (const key in OriginalMap) {
            if (OriginalMap.hasOwnProperty(key)) {
                window.mt3d.Map[key] = OriginalMap[key];
            }
        }

        console.log('[MT3D ScrollZoom Fix v4] Wrapper installed successfully');
    }
})();
