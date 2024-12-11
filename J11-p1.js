var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

const blinks = 75;

const stones = [];
for (const line of lines) {
    stones.push(...line.split(" ").map(Number));
}

function blinkStones() {

    const map = new Map();
    fillMap(map, stones);

    for (let blink = 0; blink < blinks; blink++) {

        const entries = [...map.entries()];
        map.clear();
        for (const [stone, count] of entries) {

            const stoneStr = String(stone);
            if (stone === 0) {
                addInMap(map, 1, count)
            } else if (stoneStr.length % 2 === 0) {
                const middle = Math.floor(stoneStr.length / 2);
                const before = stoneStr.slice(0, middle);
                const after = stoneStr.slice(middle, stoneStr.length);
                addInMap(map, Number(before), count)
                addInMap(map, Number(after), count)
            } else {
                addInMap(map, stone * 2024, count)
            }
        }
    }
    return map;
}

function fillMap(map, stones) {
    for (const val of stones) {
        const prevVal = map.get(val);
        if (!prevVal) {
            map.set(val, 1)
        } else {
            map.set(val, prevVal + 1)
        }
    }
}

function addInMap(map, stone, count) {

    const prevVal = map.get(stone);
    if (!prevVal) {
        map.set(stone, count ?? 1)
    } else {
        map.set(stone, prevVal + count)
    }

}

const result = blinkStones()
for (const val of [...result.values()]) {
    sum += val;
}
console.log("Result : ", sum)