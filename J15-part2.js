// NOT FINISHED

var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = test.split(/\r?\n/);
let lineIndex = 0;
const map = [];


let start = { x: 0, y: 0 };

let isSequence = false;
let moveSequence = "";

for (const line of lines) {
    const mapLine = line.split("");


    if (!isSequence) {
        let lineArr = [];
        for (let i = 0; i < mapLine.length; i++) {
            const element = mapLine[i];
            if (element === "@") {
                lineArr.push("@", ".");
            } else if (element === "#") {
                lineArr.push("#", "#");
            } else if (element === "O") {
                lineArr.push("[", "]");
            } else if (element === ".") {
                lineArr.push(".", ".");
            }
        }
        map.push(lineArr)
    } else {
        moveSequence += line;
    }

    if (line.trim() == "") {
        isSequence = true;
        continue;
    }


    lineIndex++;
}

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === "@") {
            start = { x, y }
        };
    }

}


function move() {

    let robotPos = { ...start };

    for (const move of moveSequence.split("")) {

        const nextPosition = getNextPosition(move, robotPos);
        const nextElement = map[nextPosition.y][nextPosition.x];

        const canMove = canMoveElement("@", nextPosition, nextElement, move)

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
        if (element === "[" || element === "]") {
            map[nextPosition.y][nextPosition.x] = nextElement;
        }
        return true;
    }


    // block
    if (nextElement === "[" || nextElement === "]") {
        let blockPosition = { ...nextPosition };
        const afterBlockPosition = getNextPosition(move, blockPosition);
        const afterBlockElement = map[afterBlockPosition.y][afterBlockPosition.x];

        if (canMoveElement(nextElement, afterBlockPosition, afterBlockElement, move)) {

            map[afterBlockPosition.y][afterBlockPosition.x] = nextElement;
            if (move === "^") {
                if (nextElement === "[") {
                    map[afterBlockPosition.y - 1][afterBlockPosition.x + 1] = "]";
                    map[afterBlockPosition.y][afterBlockPosition.x + 1] = ".";
                }
                if (nextElement === "]") {
                    map[afterBlockPosition.y - 1][afterBlockPosition.x + 1] = "[";
                    map[afterBlockPosition.y][afterBlockPosition.x + 1] = ".";
                }
            }
            // TODO:  Continue, wrap it, check collisions with canMove for all elements


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