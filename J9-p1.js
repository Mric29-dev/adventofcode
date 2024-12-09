var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');


let sum = 0;

let lineIndex = 0;


const inputArr = input.split("").map(Number);

let memoryArr = [];

const resultArr = [];


let scanningFile = true;

let currentId = 0;


// Parse arr
for (const char of inputArr) {

    for (let count = 0; count < char; count++) {
        memoryArr.push(scanningFile ? currentId : ".")
    }

    if (scanningFile) {
        currentId++;
    }

    scanningFile = !scanningFile;

    lineIndex++;
}


function arrangeMemory() {
    const reverseMemoryArr = [...memoryArr].reverse().filter(c => c != ".");
    const memoryLength = reverseMemoryArr.length;
    let memoryCount = 0;

    for (let i = 0; i < memoryArr.length; i++) {
        if (memoryLength <= memoryCount) { break; }

        const memoryChar = memoryArr[i];
        if (memoryChar == ".") {
            const lastDigit = reverseMemoryArr.find(c => c != ".");

            reverseMemoryArr.shift();
            resultArr.push(lastDigit)
        } else {
            resultArr.push(memoryChar);
        }

        memoryCount++
    }
}

function calc() {
    for (let i = 0; i < resultArr.length; i++) {
        const element = resultArr[i];
        sum += element * i;
    }
}


function printArr(arr) { console.log(arr.join("")) }

//printArr(memoryArr)
arrangeMemory();
//printArr(resultArr)
calc();
console.log("Result : ", sum)