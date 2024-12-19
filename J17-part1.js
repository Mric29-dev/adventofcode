var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);
const register = { A: 0, B: 0, C: 0 };

let isProgram = false;
let program = [];

let lineIndex = 0;
// Build data
for (const line of lines) {

    if (line.trim() == "") {
        isProgram = true;
        continue;
    }

    if (!isProgram) {
        const lineSplit = line.split(":");
        const value = Number(lineSplit[1].trim())

        const registerLetter = lineSplit[0].at(-1);
        register[registerLetter] = value;
    } else {
        program.push(...line.split(":")[1].trim().split(",").map(Number))
    }

    lineIndex++;
}


let out = [];

let pointer = 0;
function runProgram() {

    for (let i = 0; i < 100000; i++) {

        const instruction = program[pointer];
        if (instruction == null) { continue; }

        const litteralOperand = program[pointer + 1];
        const operandValue = getOperandValue(litteralOperand);
        console.log(register, pointer)
        doInstruction(instruction, operandValue, litteralOperand);

    }
}

function doInstruction(instruction, operandValue, litteralOperand) {
    // A / (operandValue ^ 2 )
    if (instruction === 0) {
        register.A = Math.trunc(register.A / Math.pow(2, operandValue));
    }

    if (instruction === 1) {
        register.B = register.B ^ litteralOperand;
    }

    // Mod 8 C => B
    if (instruction == 2) {
        register.B = operandValue % 8;
    }

    if (instruction === 3) {
        if (register.A !== 0) {
            pointer = litteralOperand;
            return;
        }
    }

    if (instruction === 4) {
        register.B = register.B ^ register.C;
    }

    if (instruction === 5) {
        const mod = operandValue % 8;

        out.push(...String(mod).split("").map(Number));
    }

    if (instruction === 6) {
        register.B = Math.trunc(register.A / Math.pow(2, operandValue));
    }

    if (instruction === 7) {
        register.C = Math.trunc(register.A / Math.pow(2, operandValue));
    }
    pointer += 2;
}


function getOperandValue(operand) {
    if (operand <= 3) { return operand }
    if (operand === 4) { return register.A }
    if (operand === 5) { return register.B }
    if (operand === 6) { return register.C }
    if (operand === 7) { return operand }// Unused
}

runProgram()


console.log(register, out)
console.log("Result : ", out.join(","))