var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);
let lineIndex = 0;
const map = [];

let start = { x: 0, y: 0 };

let isSequence = false;
let moveSequence = "";

// Build data
for (const line of lines) {
    const mapLine = line.split("");

    if (!isSequence) {
        map.push(mapLine);
        for (let i = 0; i < mapLine.length; i++) {
            const element = mapLine[i];
            if (element === "@") {
                start = { x: i, y: lineIndex }
            }

        }
    } else {
        moveSequence += line;
    }

    if (line.trim() == "") {
        isSequence = true;
        continue;
    }


    lineIndex++;
}


function move() {

    let robotPos = { ...start };

    for (const move of moveSequence.split("")) {

        const nextPosition = getNextPosition(move, robotPos);
        const nextElement = map[nextPosition.y][nextPosition.x];

        // move next block an others
        const canMove = canMoveElement("@", nextPosition, nextElement, move)

        // move robot
        if (canMove) {
            map[robotPos.y][robotPos.x] = ".";
            robotPos = { ...nextPosition };
            map[nextPosition.y][nextPosition.x] = "@";
        }

    }

}


function canMoveElement(element, nextPosition, nextElement, move) {
    if (nextElement === "#") { return false; }
    if (nextElement === ".") {
        if (element === "O") {
            map[nextPosition.y][nextPosition.x] = "O";
        }
        return true;
    }

    // block
    if (nextElement === "O") {
        let blockPosition = { ...nextPosition };
        const afterBlockPosition = getNextPosition(move, blockPosition);
        const afterBlockElement = map[afterBlockPosition.y][afterBlockPosition.x];

        // Move next block reccursively
        if (canMoveElement("O", afterBlockPosition, afterBlockElement, move)) {

            map[afterBlockPosition.y][afterBlockPosition.x] = "O";

            if (element === "@") {
                map[nextPosition.y][nextPosition.x] = "@";
            } else {
                map[nextPosition.y][nextPosition.x] = ".";
            }
            return true;
        } else {
            return false;
        }
    }

    return false;
}

function getNextPosition(move, position) {

    let nextPositon = { ...position };

    // up
    if (move === "^") {
        nextPositon = { y: position.y - 1, x: position.x }
    }

    // right
    if (move === ">") {
        nextPositon = { y: position.y, x: position.x + 1 }
    }

    // down
    if (move === "v") {
        nextPositon = { y: position.y + 1, x: position.x }
    }
    // left
    if (move === "<") {
        nextPositon = { y: position.y, x: position.x - 1 }
    }

    return nextPositon;
}

move()

// Display final map
map.forEach(i => console.log(i.join("")));


// Calc score
const boxes = [];
for (let y = 0; y < map.length; y++) {
    const line = map[y];
    for (let x = 0; x < line.length; x++) {
        if (line[x] == "O") {
            boxes.push({ x, y })
        }
    }
}

for (const box of boxes) {
    const { x, y } = box
    sum += (y * 100 + x);
}



console.log("Result : ", sum)