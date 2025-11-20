const fs = require('fs');
const rawSourceMap = JSON.parse(fs.readFileSync('mini-tokyo-3d.min.js.map', 'utf8'));

const mapJsIndex = 592;
const content = rawSourceMap.sourcesContent[mapJsIndex];
const lines = content.split('\n');

// Find zoom-related event listeners
console.log('=== Searching for zoom event handling ===');
lines.forEach((line, i) => {
    if ((line.includes('.on(') || line.includes('addEventListener')) &&
        (line.includes('zoom') || line.includes('wheel'))) {
        console.log((i+1) + ': ' + line.trim());
    }
});

// Find where MT3D fires zoom events
console.log('\n=== Looking for manual zoom event firing ===');
lines.forEach((line, i) => {
    if (line.includes('.fire(') && line.includes('zoom')) {
        console.log((i+1) + ': ' + line.trim());
    }
});

// Find where MT3D calls zoom functions directly
console.log('\n=== Looking for direct zoom/setZoom calls ===');
lines.forEach((line, i) => {
    if ((line.includes('.zoom(') || line.includes('.setZoom(') || line.includes('easeTo') || line.includes('flyTo')) &&
        !line.includes('getZoom')) {
        console.log((i+1) + ': ' + line.trim());
    }
});

// Look for the animation loop's zoom handling
console.log('\n=== Animation loop zoom handling (lines 1035-1090) ===');
for (let i = 1034; i < 1090 && i < lines.length; i++) {
    console.log((i+1) + ': ' + lines[i]);
}
