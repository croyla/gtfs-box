const fs = require('fs');
const rawSourceMap = JSON.parse(fs.readFileSync('mini-tokyo-3d.min.js.map', 'utf8'));

const mapJsIndex = 592;
const content = rawSourceMap.sourcesContent[mapJsIndex];
const lines = content.split('\n');

// Find the animation loop (around 1105-1214) and check if it calls _jumpTo
console.log('=== Animation loop context (lines 1105-1214) ===');
for (let i = 1104; i < 1215 && i < lines.length; i++) {
    const line = lines[i];
    // Highlight lines that call _jumpTo or jumpTo
    if (line.includes('jumpTo') || line.includes('trackObject')) {
        console.log((i+1) + ': >>> ' + line);
    } else {
        console.log((i+1) + ': ' + line);
    }
}

// Search for all calls to _jumpTo
console.log('\n=== All calls to _jumpTo in the file ===');
lines.forEach((line, i) => {
    if (line.includes('_jumpTo(') || line.includes('me._jumpTo') || line.includes('this._jumpTo')) {
        console.log((i+1) + ': ' + line.trim());
    }
});
