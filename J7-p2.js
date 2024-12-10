var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');

let sum = 0;

const lines = input.split(/\r?\n/);

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

    let operatorsCount = values.length - 1;
    let operations = Array(operatorsCount).fill("+");

    if (testEq(result, values, operations)) {
        console.log(result)
        sum += result;
        continue;
    }

    for (let i = 0; i < 3 ** operatorsCount; i++) {
        if (operations[0] == "+") { operations[0] = "*" }
        else if (operations[0] == "*") { operations[0] = "||" }
        else {
            let next = 0;
            while (operations[next] == "||") {
                operations[next++] = "+"
            };
            if (operations[next] === "+") {
                operations[next] = "*"
            } else {
                operations[next] = "||"
            }
        }

        if (testEq(result, values, operations)) {
            console.log(result)
            sum += result;
            break;
        }
    }
}

function testEq(result, values, ops) {
    let total = values[0];
    for (let i = 0; i < ops.length; i++) {
        const op = ops[i];
        if (op === "+") {
            total = total + values[i + 1];
        } else if (op === "*") {
            total = total * values[i + 1];
        } else {
            total = Number(String(total) + values[i + 1])
        }
    }
    if (result === 192) {
        console.log(ops, total)
    }

    return total == result;
}

console.log("Result", sum)
