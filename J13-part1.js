var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

const lines = test.split(/\r?\n/);

let sum = 0;

let lineIndex = 0;
const machines = [];

let currentMachine = {};
machines.push(currentMachine)

for (const line of lines) {
    if (line.trim() === "") {
        currentMachine = {};
        machines.push(currentMachine)
        continue;
    }

    const lineSplit = line.split(":");
    const left = lineSplit[0];
    const right = lineSplit[1];
    const rightSplit = right.split(", ");

    if (left.at(-1) === "A") {
        currentMachine.A = {
            X: Number((rightSplit[0]).trim().split("+")[1]),
            Y: Number(rightSplit[1].split("+")[1]),
        };
    }
    if (left.at(-1) === "B") {
        currentMachine.B = {
            X: Number((rightSplit[0]).trim().split("+")[1]),
            Y: Number(rightSplit[1].split("+")[1]),
        };
    }
    if (left.at(-1) === "e") {// Last char of "prize"
        currentMachine.prize = parsePrize(rightSplit);
    }
    lineIndex++;
}

function parsePrize(rightSplit) {
    return {
        X: Number(rightSplit[0].split("=")[1]),
        Y: Number(rightSplit[1].split("=")[1]),
    }
}

let results = [];
for (const machine of machines) {
    runMachine(machine);
}

function runMachine(machine) {

    let runCount = 3000;

    let bestToken = {
        tokens: null,
        aPress: 0,
        bPress: 0
    };
    const { A, B, prize } = machine;

    for (let aPress = 0; aPress < runCount; aPress++) {

        for (let bPress = 0; bPress < runCount; bPress++) {

            const isValid = checkRun(aPress, bPress, A, B, prize);
            if (!isValid) { continue; }
            const tokens = getTokens(aPress, bPress);
            const tokensObj = { tokens, aPress, bPress };

            if (!bestToken.tokens) { bestToken = tokensObj }
            else if (bestToken.tokens > tokens) { bestToken = tokensObj }
        }
    }

    if (bestToken.tokens != null) {
        results.push(bestToken)
    }

}

function checkRun(aPress, bPress, A, B, prize) {
    const aX = aPress * A.X;
    const aY = aPress * A.Y;

    const bX = bPress * B.X;
    const bY = bPress * B.Y;

    const X = aX + bX;
    const Y = aY + bY;

    return prize.X === X && prize.Y === Y;
}

function getTokens(aPress, bPress) {
    return 3 * aPress + bPress;
}

for (const r of results) {
    sum += r.tokens
}

console.log("Result : ", sum)