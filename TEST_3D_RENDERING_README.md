# 3D Rendering Test - Diagnostic Guide

## Purpose

`test_3d_rendering.html` is an isolated test to diagnose the root cause of map freezing by testing deck.gl/MapLibre 3D rendering **without** any GTFS data processing.

## What This Test Isolates

### ✅ Tests:
- MapLibre GL initialization
- deck.gl custom layer integration
- 3D icon rendering (IconLayer)
- WebGL context performance
- MapLibre + deck.gl compatibility

### ❌ Bypasses:
- GTFS zip file parsing
- GTFS-RT protobuf decoding
- Mini Tokyo 3D data processing
- Route/stop/shape processing
- Vehicle position interpolation

## How to Use

### 1. Open the Test
```bash
# Serve locally or use GitHub Pages
open test_3d_rendering.html
```

### 2. Run Tests in Order

1. **Click "Add 10 Vehicles"**
   - Should be instant (<50ms)
   - Map should remain interactive
   - Check debug panel for timing

2. **Click "Add 50 Vehicles"**
   - Should be fast (<100ms)
   - Slight delay acceptable
   - Monitor frozen frames

3. **Click "Add 100 Vehicles"**
   - May show brief freeze
   - This is the stress test
   - Check if map becomes unresponsive

4. **Click "Clear All"**
   - Removes all layers
   - Map should remain interactive

### 3. Check Debug Panel

Open the debug panel (🐛 button) and look for:

**Performance Metrics:**
```
Map Initialization: <time>ms
Deck.gl Layer Creation: <time>ms
Deck.gl onAdd: <time>ms
Map addLayer: <time>ms
Total Deck.gl Setup: <time>ms
```

**Warning Signs:**
- ⚠️ Any step taking >100ms
- ⚠️ "Slow render" warnings (>16.67ms)
- ⚠️ Frozen frames count increasing
- ⚠️ Long tasks detected

### 4. Export Logs

After each test:
1. Go to debug panel → Logs tab
2. Click "Export" (💾)
3. Save JSON file
4. Compare timing across 10/50/100 vehicle tests

## Expected Results

### Scenario A: No Freezes
**Result:** 10, 50, 100 vehicles all render smoothly (<100ms)

**Interpretation:**
- deck.gl and MapLibre integration is fine
- **Problem is in Mini Tokyo 3D's data processing**
- Likely culprits:
  - GTFS-RT protobuf decoding (120KB)
  - Vehicle object creation
  - Route matching algorithm
  - Position interpolation

**Next Steps:**
- Investigate Mini Tokyo 3D source code
- Consider forking Mini Tokyo 3D
- Add throttling to realtime updates
- Process data in Web Worker

### Scenario B: Freezes with 100 Vehicles
**Result:** 10/50 smooth, 100 freezes

**Interpretation:**
- deck.gl/MapLibre can handle small datasets
- **Performance degrades with scale**
- Likely culprits:
  - Too many IconLayer instances
  - SVG icon generation overhead
  - WebGL buffer updates

**Next Steps:**
- Optimize icon rendering (use sprite sheet)
- Implement level-of-detail (LOD)
- Limit visible vehicles
- Use instanced rendering

### Scenario C: Freezes with 50 Vehicles
**Result:** Even 50 vehicles cause freeze

**Interpretation:**
- **Deck.gl + MapLibre 4.5.2 compatibility issue**
- Possible causes:
  - Deck.gl's MapboxLayer not compatible with MapLibre 4.7.1
  - WebGL context conflicts
  - Custom layer integration broken

**Next Steps:**
- Check deck.gl version compatibility
- Try deck.gl's MapLibreLayer (if exists)
- Downgrade MapLibre to 3.x
- Switch to pure MapLibre markers (no deck.gl)

### Scenario D: Freezes with 10 Vehicles
**Result:** Even 10 vehicles freeze the map

**Interpretation:**
- **Critical deck.gl or MapLibre issue**
- Fundamental incompatibility
- Check browser console for errors

**Next Steps:**
- Remove deck.gl entirely
- Use native MapLibre markers
- Consider alternative libraries:
  - three.js + MapLibre
  - Pure MapLibre GL JS layers
  - Mapbox GL JS (if license allows)

## Key Metrics to Monitor

### Normal Operation:
```
Map Initialization: 50-200ms ✅
Deck.gl Layer Creation: 10-50ms ✅
Deck.gl onAdd: 20-100ms ✅
Map addLayer: 10-50ms ✅
Total Setup: <200ms ✅
Frozen Frames: 0-1 ✅
```

### Problem Indicators:
```
Total Setup: >500ms ❌
Frozen Frames: >2 ❌
Long Tasks: >200ms ❌
Render Time: >16.67ms (consistent) ❌
```

## Current Findings (2025-11-19)

Based on debug logs from production app:

### Observed Behavior:
- **Tokyo data still loading** despite `dataUrl: ''` setting
  - 13MB+ of minitokyo3d.com files being fetched
  - 82 layers added to map
- **Realtime data causing massive freezes:**
  - GTFS-RT protobuf: 120KB
  - Frame freeze: 2308ms (2.3 seconds!) ❌
  - Multiple 500ms+ freezes
  - Map becomes unresponsive

### Timeline:
```
14:31:33.823 - Map loads
14:31:38.718 - Freeze #1: 175ms
14:31:40.135 - Freeze #2: 708ms (after static GTFS loads)
14:31:43.960 - Freeze #3: 2308ms (after realtime data loads) ❌❌❌
14:31:44.509 - Freeze #4: 525ms
14:31:45.043 - Freeze #5: 516ms
```

### What Works Fine:
```
Route Control innerHTML: 0.2ms ✅
Route Control Event Setup: 0.1ms ✅
Route Update Cycle: 25.5ms ✅
```

### The Culprit:
**GTFS-RT data processing and 3D vehicle rendering** - happens inside Mini Tokyo 3D's compiled code.

## Troubleshooting

### Test Won't Load
1. Check that `debug.js` and `debug.css` exist
2. Check browser console for errors
3. Ensure `assets/style.json` exists

### No Vehicles Appear
1. Check debug panel logs for errors
2. Verify deck.gl loaded: `window.deck`
3. Check MapLibre version: map is 4.5.2

### Debug Panel Doesn't Open
1. Check that `debug.js` loaded successfully
2. Manually call: `window.debugPanel.toggle()`
3. Look for JavaScript errors in console

## Contact

If you find specific freeze points or patterns, document:
1. Which test scenario occurred (A/B/C/D)
2. Exact timing from performance metrics
3. Frozen frames count
4. Browser and OS details
5. Export debug logs (JSON)

This will help determine if the issue is:
- Mini Tokyo 3D's data processing (most likely)
- deck.gl rendering performance
- MapLibre GL integration
- Browser/GPU specific
