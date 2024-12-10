/**
 * puzzles/2024/day08/solution.ts
 *
 * ~~ Resonant Collinearity ~~
 * this is my solution for this advent of code puzzle
 *
 * by alex prosser
 * 12/7/2024
 */

/**
 * the code of part 1 of the puzzle
 */
const part1 = (input) => {
    const grid = input.trim().split('\n');
    const width = grid[0].length, height = grid.length;
    const antennas = {};

    // find all antennas with the same frequency (a-z, A-Z, 0-9)
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y][x] !== '.') {
                if (antennas[grid[y][x]] === undefined) antennas[grid[y][x]] = [];
                antennas[grid[y][x]].push({ x, y });
            }
        }
    }

    // count all unique antinodes from each pair of antennas
    const antinodes = new Set();
    Object.keys(antennas).forEach(frequency => {
        for (let i = 0; i < antennas[frequency].length; i++) {
            for (let j = 0; j < antennas[frequency].length; j++) {
                if (i === j) continue;

                const dx = antennas[frequency][j].x - antennas[frequency][i].x;
                const dy = antennas[frequency][j].y - antennas[frequency][i].y;

                const antinodeX = antennas[frequency][i].x + dx * 2;
                const antinodeY = antennas[frequency][i].y + dy * 2;

                // do bounds checking
                if (antinodeX >= 0 && antinodeX < width && antinodeY >= 0 && antinodeY < height) antinodes.add(`${antinodeX},${antinodeY}`);
            }
        }
    });

    return antinodes.size;
};
var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');
/**
 * the code of part 2 of the puzzle
 */
const part2 = () => {
    const fileContents = test.trim().split('\n');
    // Get the height and width of the data input
    let height = fileContents.length;
    let width = fileContents[0].length;
    // Save each node found
    let nodes = new Map();

    // Check each location in the input
    for (let y = 0; y < fileContents.length; y++) {
        for (let x = 0; x < fileContents[y].length; x++) {
            // Get the current location
            let current = fileContents[y][x];
            // If the spot is not blank
            if (current != '.') {
                // Add this to the set of locations for a specific node type
                let locations = nodes.has(current) ? nodes.get(current) : [];
                locations.push({ y, x });
                nodes.set(current, locations);
            }
        }
    }

    // Keep track of the set of unique anti-node locations
    let antiNodes = new Set();

    // Check each node type in the map
    nodes.forEach((locations) => {
        // Find anti-nodes between each pair of node locations for this node type
        for (let a = 0; a < locations.length; a++) {
            for (let b = a + 1; b < locations.length; b++) {
                // Get the locations for each pair of nodes
                let aLoc = locations[a];
                let bLoc = locations[b];
                // Find the difference between location a's and location b's y and x values
                let yDiff = aLoc.y - bLoc.y;
                let xDiff = aLoc.x - bLoc.x;

                // Use the differences to create the anti-node locations
                // A direction anti-nodes
                let stillInBounds = true;
                for (let i = 0; stillInBounds; i++) {
                    // The next location for an anti-node
                    let location = { y: aLoc.y + (yDiff * i), x: aLoc.x + (xDiff * i) };
                    // If it is not in bounds then stop creating more anti-nodes
                    if (!inBounds(location, height, width))
                        stillInBounds = false;
                    // Otherwise add to the set of anti-nodes
                    else
                        antiNodes.add(`${location.y},${location.x}`);
                }

                // B direction anti-nodes
                stillInBounds = true;
                for (let i = 0; stillInBounds; i++) {
                    // The next location for an anti-node
                    let location = { y: bLoc.y - (yDiff * i), x: bLoc.x - (xDiff * i) };
                    // If it is not in bounds then stop creating more anti-nodes
                    if (!inBounds(location, height, width))
                        stillInBounds = false;
                    // Otherwise add to the set of anti-nodes
                    else
                        antiNodes.add(`${location.y},${location.x}`);
                }
            }
        }
    });

    return antiNodes.size;
};

/**
 * Check if a given location is in the specified height and width bounds
 * @param {{y: number, x: number}} location 
 * @param {number} height 
 * @param {number} width 
 * @returns True if the location is in bounds
 */
const inBounds = (location, height, width) => {
    return location.y >= 0 && location.y < height && location.x >= 0 && location.x < width;
}


console.log(part2())