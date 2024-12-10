var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);


const map = [];

let lineIndex = 0;
for (const line of lines) {
    map.push(line.split("").map(Number));
    lineIndex++;
}

const starts = [];

function searchStarts() {
    let y = 0;
    for (const line of map) {
        let x = 0;
        for (const position of line) {
            if (position === 0) {
                starts.push({ x, y })
            }
            x++;
        }
        y++;
    }
}
searchStarts();

const directions = [1, 2, 3, 4];// up, left, down, right

function searchPath(position, reachsSet) {
    const currentValue = position.value;

    for (const direction of directions) {
        const nextPosition = getNextPosition(direction, position.coord);
        const nextValue = map[nextPosition.y]?.[nextPosition.x];

        if (nextValue === 9 && currentValue === 8) {
            reachsSet.add(getCoordUid(nextPosition))
            continue;
        }

        if (nextValue === ".") { continue; }
        if (currentValue + 1 !== nextValue) {
            continue;// Can't climb
        }

        searchPath({ value: nextValue, coord: nextPosition }, reachsSet);
    }
}


function getNextPosition(direction, position) {

    let nextPositon = { ...position };

    // up
    if (direction === 1) {
        nextPositon = { y: position.y - 1, x: position.x }
    }

    // right
    if (direction === 2) {
        nextPositon = { y: position.y, x: position.x + 1 }
    }

    // down
    if (direction === 3) {
        nextPositon = { y: position.y + 1, x: position.x }
    }
    // left
    if (direction === 4) {
        nextPositon = { y: position.y, x: position.x - 1 }
    }

    return nextPositon;
}



function getCoordUid(coord) {
    return `${coord.x}_${coord.y}`
}

function parseCoordUid(uid) {
    const x = Number(uid.split("_")[0])
    const y = Number(uid.split("_")[1])
    return { x, y }
}

const result = {};
for (const start of starts) {

    const reachsSet = new Set();
    searchPath({ coord: start, value: 0 }, reachsSet);

    result[getCoordUid(start)] = reachsSet;
}

console.log(result)

function calcScore() {
    for (const reachsSet of Object.values(result)) {
        sum += reachsSet.size;
    }
}

calcScore();
console.log("Result : ", sum)