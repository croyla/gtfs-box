/**
 * MT3D ScrollZoom Fix v2
 *
 * Root Cause Discovery (from debug logs):
 * - Canvas wheel #2: scrollZoomActive becomes true (scrollZoom activates)
 * - 7ms later at zoomstart: scrollZoomActive is false (something cancelled it)
 * - After zoomstart: scrollZoomActive becomes true again (MT3D's workaround)
 * - But scrollZoom is broken and can't process events anymore
 *
 * Something between scrollZoom activation and zoomstart is calling map.jumpTo()
 * which disrupts scrollZoom. Then MT3D tries to fix it by setting _active = true,
 * but this creates a broken state.
 *
 * Solution: Intercept both _jumpTo() and map.jumpTo() to prevent interference.
 */

(function() {
    'use strict';

    console.log('[MT3D ScrollZoom Fix v2] Initializing...');

    // Wait for MT3D to initialize
    const originalMt3dMap = window.mt3d?.Map;
    if (!originalMt3dMap) {
        console.warn('[MT3D ScrollZoom Fix v2] mt3d.Map not found, will try after DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyFix, 100);
        });
        return;
    }

    applyFix();

    function applyFix() {
        if (!window.mt3d?.Map) {
            console.warn('[MT3D ScrollZoom Fix v2] mt3d.Map still not found');
            return;
        }

        // Intercept MT3D Map initialization
        const OriginalMap = window.mt3d.Map;

        window.mt3d.Map = function(options) {
            const instance = new OriginalMap(options);

            // Wait for map to be ready
            instance.once('initialized', () => {
                console.log('[MT3D ScrollZoom Fix v2] Applying patches...');

                // Get the underlying MapLibre map
                const map = instance.getMapboxMap ? instance.getMapboxMap() :
                           (instance.getMap ? instance.getMap() : null);

                if (!map) {
                    console.warn('[MT3D ScrollZoom Fix v2] Could not access underlying map');
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

                // Store original jumpTo
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

                // Store original _jumpTo
                const original_jumpTo = instance._jumpTo;
                if (typeof original_jumpTo !== 'function') {
                    console.warn('[MT3D ScrollZoom Fix v2] _jumpTo method not found');
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

                console.log('[MT3D ScrollZoom Fix v2] Successfully patched jumpTo() and _jumpTo()');

                if (window.debugPanel) {
                    window.debugPanel.log('INFO', '✅ MT3D ScrollZoom Fix v2 applied', {
                        method: 'Intercepted both map.jumpTo() and _jumpTo() to prevent interference',
                        monitoring: 'scrollZoom._active state changes every 10ms'
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

        console.log('[MT3D ScrollZoom Fix v2] Wrapper installed successfully');
    }
})();
