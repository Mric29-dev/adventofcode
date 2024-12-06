var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = test.split(/\r?\n/);

let direction = 1;
const stop = "#";
const guard = "^";

let map = {};

let lineIndex = 0;


let position = { x: 0, y: 0 };

for (const line of lines) {
    const items = [];
    map[Number(lineIndex)] = {
        line: lineIndex,
        items
    };

    let itemIndex = 0;
    for (const block of line.split("")) {
        items.push({
            index: itemIndex,
            block
        });

        if (block === guard) {
            position = { y: lineIndex, x: itemIndex, }
        }
        itemIndex++;
    }

    lineIndex++;
}

function getBlockAt(lineIndex, itemIndex) {
    return map[lineIndex]?.items.find(item => item.index == itemIndex)?.block;
}

let visitedPositions = []

function run() {

    while (getBlockAt(position.y, position.x) != null) {

        const nextPositon = getNextPosition(position);

        if (getBlockAt(nextPositon.y, nextPositon.x) === stop) {
            turn()
        }


        position = getNextPosition(position);

        if (!visitedPositions.some(pos => pos.x === position.x && pos.y === position.y)) {
            visitedPositions.push({ ...position });
        }

        if (position.x < 0 || position.y < 0) {
            break;
        }

    }

}



function turn() {
    direction++;
    if (direction == 5) { direction = 1 }
}

function getNextPosition(pos) {

    let nextPositon = { ...pos };

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


console.log("start position", position)
run();
console.log("final position", position)
visitedPositions.pop(); // remove last position
console.log("visited positions", visitedPositions.length)
//console.log(map)