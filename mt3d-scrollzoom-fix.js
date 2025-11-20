/**
 * MT3D ScrollZoom Fix
 *
 * Root Cause: Mini Tokyo 3D's animation loop calls _jumpTo() every frame when tracking vehicles.
 * The condition checks !map._zooming but doesn't check !map.scrollZoom._active.
 * When user scrolls to zoom, scrollZoom._active becomes true, but map._zooming is still false
 * (because zoom level hasn't changed yet). MT3D calls _jumpTo() which cancels scrollZoom,
 * then tries to restore scrollZoom._active = true, creating a broken state.
 *
 * Solution: Intercept _jumpTo() and prevent it from running during active scroll zoom.
 * This is safer than patching the condition because it doesn't modify MT3D's source.
 */

(function() {
    'use strict';

    console.log('[MT3D ScrollZoom Fix] Initializing...');

    // Wait for MT3D to initialize
    const originalMt3dMap = window.mt3d?.Map;
    if (!originalMt3dMap) {
        console.warn('[MT3D ScrollZoom Fix] mt3d.Map not found, will try after DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(applyFix, 100);
        });
        return;
    }

    applyFix();

    function applyFix() {
        if (!window.mt3d?.Map) {
            console.warn('[MT3D ScrollZoom Fix] mt3d.Map still not found');
            return;
        }

        // Intercept MT3D Map initialization
        const OriginalMap = window.mt3d.Map;

        window.mt3d.Map = function(options) {
            const instance = new OriginalMap(options);

            // Wait for map to be ready
            instance.once('initialized', () => {
                console.log('[MT3D ScrollZoom Fix] Patching _jumpTo()');

                // Get the underlying MapLibre map
                const map = instance.getMapboxMap ? instance.getMapboxMap() :
                           (instance.getMap ? instance.getMap() : null);

                if (!map) {
                    console.warn('[MT3D ScrollZoom Fix] Could not access underlying map');
                    return;
                }

                // Store original _jumpTo
                const original_jumpTo = instance._jumpTo;
                if (typeof original_jumpTo !== 'function') {
                    console.warn('[MT3D ScrollZoom Fix] _jumpTo method not found');
                    return;
                }

                // Replace _jumpTo with patched version
                instance._jumpTo = function(options) {
                    // Check if scroll zoom is active
                    if (map.scrollZoom && map.scrollZoom._active) {
                        // Skip _jumpTo during active scroll zoom to prevent interference
                        if (window.debugPanel) {
                            window.debugPanel.log('DEBUG', '🛡️ Prevented _jumpTo() during active scroll zoom');
                        }
                        return;
                    }

                    // Call original _jumpTo
                    return original_jumpTo.call(this, options);
                };

                console.log('[MT3D ScrollZoom Fix] Successfully patched _jumpTo()');

                if (window.debugPanel) {
                    window.debugPanel.log('INFO', '✅ MT3D ScrollZoom Fix applied', {
                        method: 'Intercepted _jumpTo() to prevent interference during scroll zoom'
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

        console.log('[MT3D ScrollZoom Fix] Wrapper installed successfully');
    }
})();
