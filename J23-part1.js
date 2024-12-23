var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

let links = [];


let lineIndex = 0;
// Build data
for (const line of lines) {

    const lineSplit = line.split("-");
    links.push([lineSplit[0], lineSplit[1]]);

    lineIndex++;
}


const linksMap = new Map();
for (const link of links) {

    const linkASet = linksMap.get(link[0]) ?? new Set();
    linkASet.add(link[1]);
    linksMap.set(link[0], linkASet)

    const linkBSet = linksMap.get(link[1]) ?? new Set();
    linkBSet.add(link[0]);
    linksMap.set(link[1], linkBSet);
}

let result = new Set();
for (const [link, linkSet] of linksMap.entries()) {
    getSets(link, link, 0, []);
}


function getSets(startLink, link, depth, sequence) {
    const linksSet = linksMap.get(link) ?? new Set();
    sequence.push(link);

    if (depth + 1 <= 3) {
        for (const linkS of linksSet) {
            getSets(startLink, linkS, depth + 1, [...sequence]);

            if (depth === 2) {
                const links = linksSet.has(startLink);
                if (links) {
                    result.add(sequence.sort().join("-"))
                }
            }
        }
    }
}

result = new Set([...result].sort());

for (const l of [...result]) {
    if (l.split("-").some(link => link.at(0) === "t")) {
        sum += 1
    }
}

console.log("Result : ", sum)