var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = test.split(/\r?\n/);

let lineIndex = 0;

const equations = [];

for (const line of lines) {
    equations.push({
        result: Number(line.split([":"])[0]),
        values: (line.split([":"])[1]).trim().split(" ").map(Number)
    })
    lineIndex++;
}

for (const eq of equations) {
    const { result, values } = eq;

    const tests = [];
    let operatorsCount = values.length - 1;
    let operations = Array(operatorsCount).fill("+");

    if (testEq(result, values, operations)) {
        sum += result;
        continue;
    }

    for (let i = 0; i < 2 ** operatorsCount; i++) {
        if (operations[0] == "+") { operations[0] = "*" }
        else {
            let next = 0;
            while (operations[next] == "*") {
                operations[next++] = "+"
            };
            operations[next] = "*";
        }

        if (testEq(result, values, operations)) {
            sum += result;
            continue;
        }
    }

    console.log(operatorsCount)
    console.log("tests", tests)

}

function testEq(result, values, ops) {
    let total = values[0];
    for (let i = 0; i < ops.length; i++)
        total = ops[i] === "+" ? total + values[i + 1] : total * values[i + 1];
    return total == result;
}

console.log(equations)
console.log("Result", sum)
