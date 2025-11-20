const fs = require('fs');
const rawSourceMap = JSON.parse(fs.readFileSync('mini-tokyo-3d.min.js.map', 'utf8'));

const mapJsIndex = 592;
const content = rawSourceMap.sourcesContent[mapJsIndex];
const lines = content.split('\n');

// Find where updateHandlersAndControls is called
console.log('=== Calls to updateHandlersAndControls ===');
lines.forEach((line, i) => {
    if (line.includes('updateHandlersAndControls')) {
        console.log((i+1) + ': ' + line.trim());
    }
});

// Find where trackingMode is set (avoiding const/let declarations)
console.log('\n=== Where trackingMode is set ===');
lines.forEach((line, i) => {
    if (line.includes('trackingMode') && line.includes('=') &&
        line.includes('me.') && line.includes('trackingMode =')) {
        console.log((i+1) + ': ' + line.trim());
    }
});

// Extract the _setTrackingMode function
console.log('\n=== _setTrackingMode function ===');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('_setTrackingMode(') && lines[i].includes('mode')) {
        for (let j = i; j < Math.min(i + 50, lines.length); j++) {
            console.log((j+1) + ': ' + lines[j]);
            if (lines[j].trim() === '}' && j > i + 5) break;
        }
        break;
    }
}

// Extract _setTrackingMode function (around line 2995)
console.log('\n=== _setTrackingMode function (lines 2990-3010) ===');
for (let i = 2989; i < 3010 && i < lines.length; i++) {
    console.log((i+1) + ': ' + lines[i]);
}

// Find initialization and default trackingMode (line 111)
console.log('\n=== Initialization around line 111 (trackingMode default) ===');
for (let i = 100; i < 130 && i < lines.length; i++) {
    console.log((i+1) + ': ' + lines[i]);
}

// Find constructor or init function
console.log('\n=== Looking for constructor/init ===');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('constructor(') || (lines[i].includes('function') && lines[i].includes('init'))) {
        if (i < 200) { // Only first 200 lines likely to be constructor
            console.log('Found at line ' + (i+1));
            for (let j = i; j < Math.min(i + 20, lines.length); j++) {
                console.log((j+1) + ': ' + lines[j]);
            }
            break;
        }
    }
}
