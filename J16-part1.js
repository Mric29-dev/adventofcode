var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

let map = [];
let simpleMap = [];

let start, end;

let lineIndex = 0;
// Build data
for (const line of lines) {

    const items = line.split("");
    simpleMap.push(items);
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        const coord = { x: i, y: lineIndex };

        map.push({
            coord,
            type: element,
            uid: getCoordUid(coord)
        });
        if (element === "S") {
            start = { ...coord };
        }
        if (element === "E") {
            end = { ...coord };
        }
    }
    lineIndex++;
}

const baseMap = JSON.parse(JSON.stringify(simpleMap));
const currentPos = { ...start, direction: 2 };


const visitedCoords = new Map();
let pathId = 0;

const possibleDirections = getAvailableDirections(currentPos);
let searchPaths = [];
updatePathsFromDirections(null, possibleDirections);



const succesPaths = [];
let iter = 0;
while (searchPaths.length) {
    for (const path of searchPaths) {
        let lastPos = path.moves[path.moves.length - 1];
        if (!lastPos) { continue; }
        const possibleDirections = getAvailableDirections(lastPos);
        updatePathsFromDirections(path, possibleDirections);

        lastPos = path.moves[path.moves.length - 1];

        if (simpleMap[lastPos.y][lastPos.x] === "E" && !succesPaths.some(p => p.id === path.id)) {
            succesPaths.push(path);
            searchPaths = searchPaths.filter(p => p.id !== path.id);
        }
    }
    iter++;
}


function getAvailableDirections(pos) {

    const availableDirs = [];

    const top = getNextPosition(1, pos);
    const topElt = simpleMap[top.y][top.x];

    if (topElt !== "#") {
        availableDirs.push({ dir: 1, ...top, turn: isTurn(pos, 1) });
    }

    const right = getNextPosition(2, pos);
    const rightElt = simpleMap[right.y][right.x];
    if (rightElt !== "#") {
        availableDirs.push({ dir: 2, ...right, turn: isTurn(pos, 2) });
    }

    const bottom = getNextPosition(3, pos);
    const bottomElt = simpleMap[bottom.y][bottom.x];
    if (bottomElt !== "#") {
        availableDirs.push({ dir: 3, ...bottom, turn: isTurn(pos, 3) });
    }

    const left = getNextPosition(4, pos);
    const leftElt = simpleMap[left.y][left.x];
    if (leftElt !== "#") {
        availableDirs.push({ dir: 4, ...left, turn: isTurn(pos, 4) });
    }

    return availableDirs;
}

function isTurn(oldPos, dir) {
    return oldPos.dir !== dir;
}

function updatePathsFromDirections(path, possibleDirections) {

    if (path == null) {
        path = { id: pathId++, moves: [], score: 0 };
        searchPaths.push(path)
    }

    // remove path
    if (!possibleDirections.length) {
        searchPaths = searchPaths.filter(p => p.id !== path.id);
    }

    for (let i = possibleDirections.length - 1; i >= 0; i--) {
        const direction = possibleDirections[i];

        if (i === 0) {
            path.moves.push(direction);
            markMap(direction, path);
        } else {
            const newPath = {
                id: pathId++,
                moves: [...path.moves ?? [], direction]
            };
            searchPaths.push(newPath);

            markMap(direction, newPath);
        }
    }
}

function markMap(direction, path) {
    if (simpleMap[direction.y][direction.x] === "E") { return }
    const posUid = getCoordUid(direction);
    const isVisited = visitedCoords.get(posUid);
    if (isVisited) {
        const pathScore = getPathScore(path);
        if (isVisited.score > pathScore) {
            visitedCoords.set(posUid, { path, score: getPathScore(path) })
            searchPaths = searchPaths.filter(p => p.id !== isVisited.path.id);
        } else {
            searchPaths = searchPaths.filter(p => p.id !== path.id);
        }
    } else {
        visitedCoords.set(posUid, { path, score: getPathScore(path) })
    }
    simpleMap[direction.y][direction.x] = "X";
}

function getCoordUid(coord) {
    return `${coord.x}_${coord.y}`
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

function printMap(map = null) {
    (map ?? simpleMap).forEach(elt => console.log(elt.join("")))
}


function getPathScore(path) {
    let score = 0;
    for (const move of path.moves) {
        score += 1;
        if (move.turn) {
            score += 1000;
        }
    }
    return score;
}

console.log(succesPaths.length)
let minScore = 0;
for (const path of succesPaths) {

    let inMap = JSON.parse(JSON.stringify(baseMap));
    let score = 0;
    for (const move of path.moves) {
        score += 1;
        if (move.turn) {
            score += 1000;
        }

        inMap[move.y][move.x] = "X"
    }
    if (score < minScore || !minScore) {
        minScore = score;
    }
    console.log(score)
}

console.log("Result : ", minScore)