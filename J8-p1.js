var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

let lineIndex = 0;

const map = [];

for (const line of lines) {
    map.push(line.split(""));
    lineIndex++;
}

const X = map[0].length - 1;
const Y = map.length - 1;


const freqMap = {};

for (let i = 0; i < map.length; i++) {
    const line = map[i];

    let nodeIndex = 0;
    for (const node of line) {
        if (node === ".") {
            nodeIndex++;
            continue;
        }
        const freq = freqMap[node] ?? [];
        if (!freq.length) { freqMap[node] = freq }
        freq.push({
            frequence: node,
            x: nodeIndex,
            y: i,
            id: String(nodeIndex) + i
        })
        nodeIndex++;
    }
}


const antinodeMap = {};
const testedFreqs = new Set();
for (const [freqNode, freqs] of Object.entries(freqMap)) {
    for (const freqA of freqs) {
        for (const freqB of freqs) {
            if (freqA.id === freqB.id) { continue }

            // Avoid double checks
            const testId = [freqA.id, freqB.id].sort().join("_");
            if (testedFreqs.has(testId)) { continue }

            testedFreqs.add(testId);

            const delta = { x: freqA.x - freqB.x, y: freqA.y - freqB.y }


            const anti1 = { x: freqB.x - delta.x, y: freqB.y - delta.y }
            const anti2 = { x: freqA.x + delta.x, y: freqA.y + delta.y }

            const antinodeFreq = antinodeMap[freqNode] ?? [];
            if (!antinodeFreq.length) { antinodeMap[freqNode] = antinodeFreq }
            antinodeFreq.push({
                testId,
                anti: 1,
                coord: anti1
            })
            antinodeFreq.push({
                testId,
                anti: 2,
                coord: anti2
            })

        }
    }
}

const testedAnti = new Set();

function filterBounds() {
    let antiNodeInBoundsCount = 0;
    for (const [freqNode, freqs] of Object.entries(antinodeMap)) {
        for (const freq of freqs) {
            const coords = freq.coord;
            if (testedAnti.has(coords.x + ':' + coords.y)) { continue; }

            //console.log(freq, coords)
            if (coords.x >= 0 && coords.x <= X && coords.y >= 0 && coords.y <= Y) {
                antiNodeInBoundsCount++;
                testedAnti.add(coords.x + ':' + coords.y)
            }
        }
    }
    return antiNodeInBoundsCount;

}

sum = filterBounds()

console.log("Result", sum)

