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

let result = "";
for (const [link, linkSet] of linksMap.entries()) {
    const r = getSets(link, link, 0, []);

    if (r.result.length > result.length) {
        result = r.result;
    }
}


function getSets(startLink, link, depth, sequence) {
    linksSet = linksMap.get(link) ?? new Set();
    linksSet = new Set([...linksSet].sort());
    linksSet.add(startLink);

    const sets = new Map();
    let max = 0;
    for (const subLink of linksSet) {
        if (startLink === subLink) { continue }

        const subLinkLinksSet = linksMap.get(subLink) ?? new Set();

        const same = [...subLinkLinksSet].filter(l => linksSet.has(l));

        if (same.length > max) {
            max = same.length;
        }

        sets.set(subLink, same);
    }

    const directs = [];
    for (const [key, arr] of sets.entries()) {
        let isDirect = true;
        let size = arr.length;

        for (const l of arr) {
            if (l === startLink) { continue; }
            const siblingLength = sets.get(l)?.length;

            if (siblingLength != size) {
                isDirect = false;
            }
        }
        if (isDirect) {
            directs.push([...arr, key]);
        }
    }

    const keep = new Set();
    directs.forEach(d => keep.add(d.sort().join(",")));

    let maxStr = "";
    [...keep].forEach(k => {
        if (maxStr.length < k.length) {
            maxStr = k;
        }
    })

    return { result: maxStr, max };
}


console.log("Result : ", result)