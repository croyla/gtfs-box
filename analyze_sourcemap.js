const fs = require('fs');
const rawSourceMap = JSON.parse(fs.readFileSync('mini-tokyo-3d.min.js.map', 'utf8'));

const mapJsIndex = 592;
const content = rawSourceMap.sourcesContent[mapJsIndex];
const lines = content.split('\n');

// Look at updateBusShape function
console.log('=== updateBusShape function (lines 1334-1450) ===');
for (let i = 1333; i < 1450 && i < lines.length; i++) {
    console.log((i+1) + ': ' + lines[i]);
}

// Look for refreshBuses function
console.log('\n=== Searching for refreshBuses function ===');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'refreshBuses(gtfsId) {') {
        console.log('\nFound at line ' + (i+1));
        for (let j = i; j < Math.min(i + 100, lines.length); j++) {
            console.log((j+1) + ': ' + lines[j]);
        }
        break;
    }
}
