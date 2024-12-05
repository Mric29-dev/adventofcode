

var fs = require('fs');
let input = fs.readFileSync("day3.txt", 'utf8');
console.log(input)

let test = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`

const regex = /mul\(\d+,\d+\)/gm;
const matchs = test.matchAll(regex)

let sum = 0;
for (const match of matchs) {
    const m = match[0];
    const left = (m.split(",")[0].split("(")[1])
    const right = (m.split(",")[1].split(")")[0])

    sum += (left * right)
}

console.log(sum)
// 42min42