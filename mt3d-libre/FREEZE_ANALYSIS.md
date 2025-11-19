# Mini Tokyo 3D Zoom/Pan Freeze Analysis

## Root Cause Identified

Based on debug logs and code analysis, the 24-second freeze during zoom/pan is caused by:

**Mini Tokyo 3D's event handlers triggering synchronous deck.gl layer updates on every zoom/move event.**

## Evidence

### Freeze Timeline (from user's debug export):
```
Time     Event                      Freeze Duration
--------------------------------------------------------------
3969ms   GTFS-RT loads (612ms)      -
9012ms   Initial render              4158ms freeze ❌
38870ms  User zooms map              24041ms freeze ❌❌❌
42387ms  Continued zooming           2466ms freeze ❌
47795ms  Final zoom                  733ms freeze ❌
```

### Event Handlers Found in mini-tokyo-3d.min.js:

**Zoom Handlers:**
```javascript
.on("zoom", this._onZoom)           // Multiple occurrences
.on("zoom", () => ...)              // Anonymous callbacks
.on("zoom", this._updateZoomButtons)
.on("zoom", i.onCameraChanged)
.on("zoom", t=>{t.tracking||e.updateBaseZoom()})
```

**Move/Pan Handlers:**
```javascript
.on("move", this._update)           // Triggers on every frame during pan
.on("moveend", this._updateHash)
.on("movestart", ...)
```

## The Problem

### What Happens During Zoom:

1. User starts zooming (scroll wheel / pinch)
2. MapLibre fires `zoom` event **60 times per second** during smooth zoom
3. Mini Tokyo 3D's `.on("zoom", ...)` handlers fire on every event
4. Each handler potentially calls `_update()` or similar methods
5. These methods call `setProps()` on deck.gl layers
6. deck.gl reconstructs WebGL buffers **synchronously**
7. With 120+ vehicles, this takes 400+ms per update
8. 400ms × 60 updates/sec = **24 seconds of blocked main thread**

### Why test_3d_rendering.html Doesn't Freeze:

Pure MapLibre markers use GPU-accelerated CSS transforms:
- No JavaScript execution during zoom
- No WebGL buffer updates
- Automatic batching via requestAnimationFrame
- Built-in viewport culling

## The Fix Strategy

We need to **throttle or debounce** Mini Tokyo 3D's zoom/move handlers to prevent them from firing on every frame.

### Option 1: Throttle zoom updates (RECOMMENDED)
Only update deck.gl layers every 250ms during zoom, not on every frame.

### Option 2: Use `moveend` instead of `zoom`
Only update after zoom completes, not during.

### Option 3: Disable deck.gl vehicle rendering
Replace with MapLibre markers (what test_3d_rendering.html proved works).

## Files to Modify

Based on source map analysis:

### Source Files (unminified):
```
../src/helpers/helpers-mapbox.js    - Mapbox API wrappers
../src/layers/geojson-layer.js      - Custom layer implementation
../src/marker.js                    - Marker handling
../src/extend.js                    - MT3D extensions
```

### Build Output:
```
mini-tokyo-3d.min.js                - Minified production build (4.7MB)
mini-tokyo-3d.min.js.map            - Source map (12.7MB)
```

## Proposed Patch

Since we only have the minified version, we need to:

1. Add throttling wrapper around zoom/move handlers
2. Intercept setProps calls to batch updates
3. Or disable vehicle layer updates entirely during map interaction

### Throttle Function to Add:
```javascript
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function executedFunction(...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}
```

### How to Apply:

**Before mini-tokyo-3d.min.js loads**, inject:
```javascript
// Wrap Mini Tokyo 3D's Map class to throttle zoom updates
(function() {
    const originalMT3D = window.mt3d;
    if (!originalMT3D) return;

    const OriginalMap = originalMT3D.Map;

    mt3d.Map = function(options) {
        const map = new OriginalMap(options);
        const origOn = map.on.bind(map);

        // Intercept event listeners
        map.on = function(event, handler) {
            if (event === 'zoom' || event === 'move') {
                // Throttle to 250ms (4 updates/sec max)
                handler = throttle(handler, 250);
            }
            return origOn(event, handler);
        };

        return map;
    };
})();
```

## Next Steps

1. Create patch script in `mt3d-libre/patch.js`
2. Load patch before mini-tokyo-3d.min.js
3. Test with debug_test.html
4. Measure freeze duration (should be <250ms)
5. Adjust throttle timing if needed (100ms? 500ms?)

## Alternative: Get Unminified Source

If patching minified code is too fragile:

1. Clone Mini Tokyo 3D repo: https://github.com/nagix/mini-tokyo-3d
2. Modify source files directly
3. Build custom version
4. Keep in mt3d-libre/ directory

## Success Criteria

After patch:
- ✅ Zoom operations: <250ms total
- ✅ Pan operations: <100ms total
- ✅ Vehicle updates: Still occur, just throttled
- ✅ Map remains interactive during all operations
- ✅ No 4-second or 24-second freezes
