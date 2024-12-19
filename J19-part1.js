var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

let towels = [];

let designs = [];


let isTowel = true;

let lineIndex = 0;
// Build data
for (const line of lines) {

    if (line.trim() === "") {
        isTowel = false;
        continue;
    }

    if (isTowel) {
        towels.push(...line.split(", "));
    }
    else {
        designs.push(line)
    }
    lineIndex++;
}

let count = 0
for (const design of designs) {
    count++;

    let max = [0];
    const sequences = [];
    const searchResult = searchTowel(design, 0, sequences, max);

    if (searchResult) { sum++ }
}


function searchTowel(design, pointer, sequences, max) {

    const searchedLetter = design[pointer];
    const matchingTowels = getMatchingTowels(searchedLetter);

    const previousSequences = [...sequences];

    for (const towel of matchingTowels) {
        let isCorrect = true;
        const currSequence = [...previousSequences];

        towel.split("").forEach((t, i) => {
            isCorrect = design[pointer + i] === t;
        });

        if (!isCorrect) { continue; }

        const seqStr = currSequence.join("") + towel;

        if (design === seqStr) {
            currSequence.push(towel);
            return true;
        }

        if (!design.includes(seqStr)) { continue; }

        currSequence.push(towel);

        max[0]++;

        const search = searchTowel(design, pointer + towel.length, currSequence, max);
        if (search) {
            return true;
        }

        // Force finish
        if (max[0] > 10000) {
            return false
        }
    }

    return false;

}

function getMatchingTowels(letter) {
    return towels.filter(t => t.at(0) === letter);
}

console.log("Result : ", sum)