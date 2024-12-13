var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

const lines = input.split(/\r?\n/);

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
        X: Number(rightSplit[0].split("=")[1]) + 10000000000000,
        Y: Number(rightSplit[1].split("=")[1]) + 10000000000000,
    }
}

let results = [];
for (const machine of machines) {
    runMachine(machine)
}

function runMachine(machine) {

    const { A, B, prize } = machine;

    let bPress = (prize.Y * A.X - prize.X * A.Y) / (B.Y * A.X - B.X * A.Y);
    let aPress = (prize.X - bPress * B.X) / A.X;

    // Check int press only
    if (Number.isInteger(bPress) && Number.isInteger(aPress)) {

        const isValid = checkRun(aPress, bPress, A, B, prize);
        if (isValid) {
            const tokens = getTokens(aPress, bPress);
            const tokensObj = { tokens, aPress, bPress };
            results.push(tokensObj)
        }
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

console.log(results)
for (const r of results) {
    sum += r.tokens
}

console.log("Result : ", sum)