var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

let buyers = [];


let lineIndex = 0;
// Build data
for (const line of lines) {
    buyers.push(Number(line));
    lineIndex++;
}

let rounds = 2000;

const secrets = [];
for (const buyer of buyers) {

    let currentSecret = buyer;
    for (let i = 0; i < rounds; i++) {
        currentSecret = nextSecret(currentSecret);
    }
    console.log(buyer, currentSecret)
    secrets.push(currentSecret)
}

function nextSecret(secret) {
    const mul = secret * 64;
    let result = mix(secret, mul);
    result = prune(result);

    const div = Math.floor(result / 32);
    result = mix(result, div);
    result = prune(result);

    const mul2 = result * 2048;
    result = mix(result, mul2);
    result = prune(result);

    return result;
}

function mix(secret, value) {
    return secret ^ value;
}

function prune(secret) {
    return ((secret % 16777216) + 16777216) % 16777216;
}

console.log("Result : ", secrets.reduce((prev, curr) => prev + curr))