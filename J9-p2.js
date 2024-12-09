var fs = require('fs');
const input = fs.readFileSync("input.txt", 'utf8');
const test = fs.readFileSync("test.txt", 'utf8');


let sum = 0;

let lineIndex = 0;


const inputArr = test.split("").map(Number);

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

let reverseFragementedMemoryArr = []
function arrangeMemory() {
    const fragmentedMemory = [];


    let isFile = undefined;// boolean | undefined
    let createNew = true;

    // Split memory into fragments
    /* 
    [
        { index: 0, arr: [ 0, 0 ], isFile: true },
        { index: 2, arr: [ '.', '.', '.' ], isFile: false },
        { index: 5, arr: [ 1, 1, 1 ], isFile: true },
        { index: 8, arr: [ '.', '.', '.' ], isFile: false },
        { index: 11, arr: [ 2 ], isFile: true },
        { index: 12, arr: [ '.', '.', '.' ], isFile: false },
         ...
    ]
    */

    // Current fragment builded
    let currentFragment = [];

    for (let i = 0; i < memoryArr.length; i++) {
        const char = memoryArr[i];
        const isFileState = isFile;

        isFile = char != ".";
        createNew = isFileState !== isFile;
        if (currentFragment[0] !== char) { createNew = true }

        if (createNew) {
            currentFragment = [];
            fragmentedMemory.push({ index: i, arr: currentFragment, isFile });
        }

        currentFragment.push(char)
    }

    // reserve to search for most right one
    reverseFragementedMemoryArr = [...fragmentedMemory].reverse();

    let fragmentIndex = 0;
    for (const fragment of fragmentedMemory) {
        if (fragment.isFile) {
            // nothing todo
        } else {
            const lastFitFragment = getLastFitFragment(fragment);
            const fragmentFit = lastFitFragment.fragmentFit;

            if (fragmentFit) {
                // replace current with new one (unused)
                fragment.arr = fragmentFit?.arr ?? [];
                fragmentFit.arr = lastFitFragment.fragmentFit.arr.map(item => ".")

                // add missing size as a new fragment to check for
                if (lastFitFragment.missingSize > 0) {
                    fragmentedMemory.splice(fragmentIndex + 1, 0,
                        {
                            ...fragment,
                            index: fragment.index + lastFitFragment.newArr.length - lastFitFragment.missingSize,
                            arr: Array(lastFitFragment.missingSize).fill(".")
                        }
                    );
                }
            }
        }

        fragmentIndex++;
    }

    // Join fragmented memory into flat arr
    for (const frag of fragmentedMemory) {
        resultArr.push(...frag.arr)
    }

}

function getLastFitFragment(fragment) {

    const size = fragment.arr.length;

    // Last file with enought size, check for index check (don't put file backward in memory)
    const fragmentFit = reverseFragementedMemoryArr.find(f => f.arr.length <= size && f.isFile && fragment.index < f.index);

    if (!fragmentFit) { return [{ newArr: [], missingSize: 0 }] }

    // Empty memory to fill
    const missingDotArr = Array(size - fragmentFit.arr.length).fill(".");

    // Remove fragmentFit from memory reversed
    reverseFragementedMemoryArr = reverseFragementedMemoryArr.filter(item => item.index !== fragmentFit.index)

    return {
        fragmentFit,
        newArr: [
            ...fragmentFit.arr,
            ...missingDotArr
        ],// ex: [9,9,.] for [".", ".", "."] empty space
        missingSize: missingDotArr.length
    }
}

// Calc result
function calc() {
    for (let i = 0; i < resultArr.length; i++) {
        const element = resultArr[i];
        if (element != ".") {
            sum += element * i;
        }
    }
}


function printArr(arr) { console.log(arr.join("")) }

//printArr(memoryArr)
arrangeMemory();
//printArr(resultArr)
calc();
console.log("Result : ", sum)