

var fs = require('fs');
let input = fs.readFileSync("day3.txt", 'utf8');


let test = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`

const regex = /mul\(\d+,\d+\)|don't\(\)|do\(\)/gm;
const matchs = input.matchAll(regex)

let sum = 0;
let doMul = true;
for (const match of matchs) {
    const m = match[0];

    if (m.includes("don")) {
        doMul = false;
    } else if (m.includes("do()")) {
        doMul = true;
    } else if (doMul) {
        const left = (m.split(",")[0].split("(")[1])
        const right = (m.split(",")[1].split(")")[0])

        sum += (left * right)
    }

}

console.log(sum)
// 22min45