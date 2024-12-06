var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');


const lines = input.split(/\r?\n/);

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

let visitedPositions = [];

const startPosition = { ...position };

function run(obstruction = null) {

    let boucle = false;

    direction = 1;

    let maxLoop = 10000;
    let loopCount = 0;

    while (getBlockAt(position.y, position.x) != null) {

        if (loopCount > maxLoop) {
            boucle = true;
            break;
        }

        const nextPositon = getNextPosition(position);

        if (getBlockAt(nextPositon.y, nextPositon.x) === stop) {
            turn()
        } else if (obstruction && nextPositon.y == obstruction.y && nextPositon.x == obstruction.x) {
            turn()
            const afterObtructionPost = getNextPosition(nextPositon)
            if (getBlockAt(afterObtructionPost.y, afterObtructionPost.x) === stop) {
                turn()
            }

        }

        position = getNextPosition(position);

        if (obstruction == null && !visitedPositions.some(pos => pos.x === position.x && pos.y === position.y)) {
            visitedPositions.push({ ...position });
        }

        if (position.x < 0 || position.y < 0) {
            break;
        }

        loopCount++;

    }

    return boucle;

}

function turn() {
    direction++;
    if (direction == 5) { direction = 1 }
}

function testObstruction() {

    let boucleCount = 0;

    console.log(visitedPositions.length)
    visitedPositions.pop()
    for (const visitedPosition of visitedPositions) {
        position = { ...startPosition };// reset start
        const res = run({ ...visitedPosition });
        if (res) {
            boucleCount++
        }
    }
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

run();
testObstruction();