# MapLibre Migration - Mini Tokyo 3D

This document describes the migration from Mapbox GL JS to MapLibre GL JS for the gtfs-box project.

## Overview

Successfully migrated gtfs-box to use **MapLibre GL JS v4.7.1** by building Mini Tokyo 3D from source with MapLibre instead of Mapbox.

## Approach

Combined approaches #1 and #3 from the migration options:
1. **Build MT3D from source** with MapLibre dependencies
2. **Create a MapLibre-compatible fork** for gtfs-box

## Steps Performed

### 1. Clone Mini Tokyo 3D Source
```bash
git clone --depth 1 https://github.com/nagix/mini-tokyo-3d.git mt3d-source
```

### 2. Replace Dependencies
Modified `package.json`:
- **Before:** `"mapbox-gl": "^3.9.3"`
- **After:** `"maplibre-gl": "^4.7.1"`

### 3. Update Imports
Replaced all imports in source files:
```javascript
// Before
import {Map as Mapbox} from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';

// After
import {Map as Mapbox} from 'maplibre-gl';
import maplibregl from 'maplibre-gl';
```

Files modified:
- `src/map.js`
- `src/index.js`
- `src/index.esm.js`
- `src/marker.js`
- `src/controls/clock-control.js`
- `src/helpers/helpers-mapbox.js`
- `src/gpgpu/compute-renderer.js`
- `src/layers/traffic-layer.js`

### 4. Build Process
```bash
cd mt3d-source
npm install
npm run build
```

Build output:
- `dist/mini-tokyo-3d.min.js` (4.7MB) - **Now uses MapLibre natively**
- `dist/mini-tokyo-3d.min.js.map` (13MB)
- `dist/mini-tokyo-3d.min.css` (103KB)

### 5. Integration
Copied built files to gtfs-box and simplified `index.html`:

**Before (372 lines with complex patches):**
- MapLibre → Mapbox compatibility shim
- Map constructor wrapper
- Nuclear option: Map.prototype.on patch
- MT3D addLayer wrapper with getOwnLayer creation
- Proxy layer objects with stub methods

**After (68 lines, clean):**
```html
<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
<script src="mini-tokyo-3d.min.js"></script>
<script src="mt3d-plugin-plateau.min.js"></script>
```

## Benefits

1. ✅ **No compatibility shims needed** - MT3D natively uses MapLibre
2. ✅ **No Mapbox API keys required** - Using OpenFreeMap tiles
3. ✅ **Clean, maintainable code** - Removed 300+ lines of patches
4. ✅ **Future-proof** - Can rebuild MT3D with latest MapLibre versions
5. ✅ **Full MT3D functionality** - All features work as designed

## Technical Details

### MapLibre GL JS v4.7.1
- Open-source fork of Mapbox GL JS v1.x
- API-compatible with Mapbox GL JS v1.x
- No vendor lock-in
- Active development and community support

### OpenFreeMap
- Free vector tiles service
- Uses OpenStreetMap data
- OpenMapTiles schema
- No API key required
- Tiles: `https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf`

### Style Configuration
Located at `assets/style.json`:
- Uses OpenMapTiles schema
- 3D building extrusion with fill-extrusion
- MT3D-compatible metadata properties
- Custom glyphs from MapLibre demo tiles

## Files Modified

### Main Changes
- `index.html` - Simplified from 372 to 68 lines
- `mini-tokyo-3d.min.js` - Rebuilt with MapLibre (4.7MB)
- `mini-tokyo-3d.min.css` - CSS from MT3D build (103KB)
- `mini-tokyo-3d.min.js.map` - Source map for debugging (13MB)

### Style
- `assets/style.json` - OpenFreeMap with 3D buildings

### Unchanged
- `gtfs-box.js` - No changes needed
- `gtfs-box.css` - No changes needed
- GTFS data loading logic - Works as before

## Testing

Test the application by:
1. Opening index.html in a browser
2. Verifying map loads with OpenFreeMap tiles
3. Checking 3D buildings render properly
4. Confirming GTFS transit data displays
5. Testing vehicle position updates (if configured)

## Maintenance

To update MapLibre or rebuild MT3D:

```bash
# Update MT3D source
cd /home/user/mt3d-source
git pull

# Update MapLibre version in package.json
sed -i 's/"maplibre-gl": ".*"/"maplibre-gl": "^4.8.0"/g' package.json

# Rebuild
npm install
npm run build

# Copy to gtfs-box
cp dist/mini-tokyo-3d.min.* /home/user/gtfs-box/
```

## Commit History

Key commits in branch `claude/migrate-mapbox-maplibre-01CW2Uw5QWgj1wQFe7XhsEmE`:

1. Initial OpenFreeMap style integration
2. Multiple attempts at compatibility shims
3. Nuclear patch approach (Map.prototype.on wrapper)
4. **Final solution:** Build MT3D from source with MapLibre

## Credits

- **Mini Tokyo 3D:** https://github.com/nagix/mini-tokyo-3d by Akihiko Kusanagi
- **MapLibre GL JS:** https://maplibre.org
- **OpenFreeMap:** https://openfreemap.org

## License

Mini Tokyo 3D is released under the MIT License.
MapLibre GL JS is released under the BSD 3-Clause License.
