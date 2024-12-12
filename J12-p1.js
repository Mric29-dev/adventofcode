var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);
let lineIndex = 0;
const map = [];
const plantTypes = new Set();

const directions = [1, 2, 3, 4];// up, left, down, right

for (const line of lines) {
    const plants = line.split("");
    plants.forEach(p => plantTypes.add(p));

    for (let i = 0; i < plants.length; i++) {
        const element = plants[i];
        const coord = { x: i, y: lineIndex };
        map.push({
            coord,
            type: element,
            uid: getCoordUid(coord)
        });
    }
    lineIndex++;
}

const areaMap = new Map();
for (const plantType of [...plantTypes.values()]) {
    areaMap.set(plantType, { used: new Set(), areas: new Map() });
    searchAreas(plantType, areaMap)
}

function searchAreas(plantType, areaMap) {
    const plantTypeCoords = map.filter(p => p.type === plantType);

    for (const plantTypeCoord of plantTypeCoords) {
        let planteTypeAreaMap = areaMap.get(plantType);
        // Coord already checked in an area
        if (planteTypeAreaMap?.used?.has(getCoordUid(plantTypeCoord.coord))) {
            continue;
        }

        // Set area
        const areaUid = getCoordUid(plantTypeCoord.coord)
        const area = { plants: new Set(), fences: [] };
        planteTypeAreaMap?.areas?.set(areaUid, area);

        // Set used coords and plants
        planteTypeAreaMap.used.add(getCoordUid(plantTypeCoord.coord))
        area.plants.add(getCoordUid(plantTypeCoord.coord));

        // Search full area
        searchPlanTypeArea(plantType, plantTypeCoord.coord, areaMap, area);
    }
}

function searchPlanTypeArea(plantType, coord, areaMap, area) {
    for (const direction of directions) {

        // Search for element in given direction
        const nextPosition = getNextPosition(direction, coord);
        const nextElement = map.find(elt => elt.uid === getCoordUid(nextPosition));
        const nextValue = nextElement?.type;

        // Outer bounds, add fence
        if (nextValue == null) {
            area.fences.push({ direction, coord })
            continue
        }

        // Not continous area, add fence
        if (nextValue !== plantType) {
            area.fences.push({ direction, coord });
            continue;
        }

        const planteTypeAreaMap = areaMap.get(plantType);
        if (planteTypeAreaMap) {// useless check

            // Already checked
            if (area.plants.has(getCoordUid(nextPosition))) {
                continue;
            }

            // Add plant to area and used list
            area.plants.add(getCoordUid(nextPosition));
            planteTypeAreaMap.used.add(getCoordUid(nextPosition));
        }

        // Search for other elements in area
        searchPlanTypeArea(plantType, nextPosition, areaMap, area);
    }
}

function getCoordUid(coord) {
    return `${coord.x}_${coord.y}`
}
function getFenceUid(fence) {
    return `${fence.coord.x}_${fence.coord.y}_${fence.direction}`
}

function parseCoordUid(uid) {
    const x = Number(uid.split("_")[0])
    const y = Number(uid.split("_")[1])
    return { x, y }
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


// Part 1
/*for (const plantAreas of [...areaMap.values()]) {
    for (const area of [...plantAreas.areas.values()]) {
        const areaSize = area.plants.size;
        const fences = area.fences.length;
        sum += areaSize * fences
    }
}*/

// Part 2
for (const plantAreas of [...areaMap.values()]) {
    for (const area of [...plantAreas.areas.values()]) {
        const areaSize = area.plants.size;
        const fences = area.fences;

        let usedFences = new Set();
        let sideCount = 0;

        for (const fence of fences) {
            const fenceUid = getFenceUid(fence);
            // Already checked
            if (usedFences.has(fenceUid)) { continue; }
            usedFences.add(fenceUid);

            // Search all fences in Left and Right direction (first search)
            let nextFenceDirections = [fence.direction + 1, fence.direction - 1];

            // (from top to right/left, left to top/bottom, bottom to left/right, etc.)
            for (let i = 0; i < nextFenceDirections.length; i++) {
                if (nextFenceDirections[i] === 5) { nextFenceDirections[i] = 1 }
                if (nextFenceDirections[i] === 0) { nextFenceDirections[i] = 4 }
            }

            let nextPositionAfter = getNextPosition(nextFenceDirections[0], fence.coord);
            const nextFenceUidResearchedAfter = getFenceUid({ direction: fence.direction, coord: nextPositionAfter });
            let nextFenceAfter = fences.find(f => getFenceUid(f) === nextFenceUidResearchedAfter);
            if (nextFenceAfter) {
                usedFences.add(getFenceUid(nextFenceAfter));
            }

            // Search for all others fences in after side
            while (nextFenceAfter != null) {

                nextPositionAfter = getNextPosition(nextFenceDirections[0], nextFenceAfter.coord);
                const nextFenceUidResearchedAfter = getFenceUid({ direction: fence.direction, coord: nextPositionAfter });
                nextFenceAfter = fences.find(f => getFenceUid(f) === nextFenceUidResearchedAfter);
                if (nextFenceAfter) {
                    usedFences.add(getFenceUid(nextFenceAfter));
                }
            }

            // Search for fence before current fence
            let nextPositionBefore = getNextPosition(nextFenceDirections[1], fence.coord);
            const nextFenceUidResearchedBefore = getFenceUid({ direction: fence.direction, coord: nextPositionBefore });
            let nextFenceBefore = fences.find(f => getFenceUid(f) === nextFenceUidResearchedBefore);
            if (nextFenceBefore) {
                usedFences.add(getFenceUid(nextFenceBefore));
            }

            // Search for all others fences in before side
            while (nextFenceBefore != null) {
                nextPositionBefore = getNextPosition(nextFenceDirections[1], nextFenceBefore.coord);
                const nextFenceUidResearchedBefore = getFenceUid({ direction: fence.direction, coord: nextPositionBefore });
                nextFenceBefore = fences.find(f => getFenceUid(f) === nextFenceUidResearchedBefore);

                if (nextFenceBefore) {
                    usedFences.add(getFenceUid(nextFenceBefore));
                }
            }

            sideCount++;
        }

        sum += areaSize * sideCount;
    }
}

console.log("Result : ", sum)