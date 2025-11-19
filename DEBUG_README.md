# Debug Test Page

## Overview

The `debug_test.html` page is a dedicated debugging environment for diagnosing freezing issues in GTFS Box, particularly those related to 3D rendering and realtime feed processing.

## How to Use

### Opening the Debug Page

Open `debug_test.html` in your browser instead of `index.html`:

```
http://localhost:8080/debug_test.html
```

The debug panel will automatically open after 1 second.

### Debug Panel Features

The debug panel appears in the bottom-right corner with a 🐛 button. It includes:

#### 1. Logs Tab
- **Real-time logging** of all operations
- **Color-coded levels**: ERROR (red), WARN (yellow), INFO (green), DEBUG (blue)
- **Timestamps** with millisecond precision
- **Search and filtering** capabilities

#### 2. Network Tab
- All `fetch()` calls with timing information
- Response status codes and sizes
- Pending vs completed requests
- Special highlighting for GTFS realtime endpoints

#### 3. Performance Tab
- Operation timing metrics (avg, min, max)
- Number of operations performed
- Automatic warnings for slow operations (>50ms)

### Key Metrics Displayed

At the top of the debug panel:

- **Network Calls**: Total number of fetch requests
- **Pending**: Currently in-flight requests (yellow if >0)
- **Frozen Frames**: Count of frames >100ms (red if detected)
- **FPS**: Real-time frame rate (red <30, yellow <50, green ≥50)

## What to Look For

### Diagnosing Freezing Issues

1. **Before the Freeze**
   Look for this log message:
   ```
   [WARN] About to render X 3D vehicles - this may trigger freeze
   ```
   This appears right before 3D rendering starts.

2. **Map Library Version**
   Check these logs:
   ```
   [INFO] Underlying map instance found
   ```
   Shows whether you're using Mapbox or MapLibre.

3. **WebGL Information**
   ```
   [INFO] WebGL context information
   ```
   Shows graphics card details and capabilities.

4. **API Errors**
   ```
   [ERROR] Underlying map error
   [ERROR] Unhandled error
   ```
   Look for MapLibre/Mapbox API incompatibilities.

### Common Issues to Check

#### 1. Network Response Time
- Check Network tab for slow GTFS realtime requests
- Look for requests >2000ms
- Check for pending requests that never complete

#### 2. 3D Rendering
- Count of vehicles being rendered
- WebGL errors during rendering
- Style data changes when layers are added

#### 3. Main Thread Blocking
- Operations taking >100ms
- Route update cycles >50ms
- Frame freezes detected

#### 4. MapLibre Compatibility
- Errors mentioning missing methods
- deck.gl initialization failures
- Custom layer errors

## Export Debug Logs

Click the 💾 button to export all logs as JSON for analysis or sharing.

The export includes:
- All log entries
- Network call details
- Performance metrics
- Frozen frame count

## Debug Panel Controls

- **🗑️ Clear**: Clear all logs
- **💾 Export**: Download logs as JSON
- **✖️ Close**: Hide debug panel
- **🐛 Button**: Toggle panel visibility

## Troubleshooting the Debug Panel

If the debug panel doesn't appear:

1. **Check browser console** for initialization errors
2. **Verify files are loaded**:
   - `debug.js`
   - `debug.css`
   - `gtfs-box.js`

If there's an error, the debug panel creates a minimal stub to prevent breaking the app.

## Production vs Debug

- **index.html** - Clean production page (no debug overhead)
- **debug_test.html** - Full debugging capabilities

Always test fixes on `debug_test.html` first before deploying to `index.html`.
