let array = [];
let speed = 5;
let sortedArray = []; // To store a sorted version of the array for specific algorithms

document.getElementById('speed').addEventListener('input', (e) => {
    speed = 11 - e.target.value;
});

// Generate a random array based on the number of elements entered
function generateArray() {
    const numElements = prompt("Enter the number of elements for the array:");
    array = [];
    
    if (numElements) {
        for (let i = 0; i < numElements; i++) {
            array.push(Math.floor(Math.random() * 300) + 10);
        }
        sortedArray = [...array].sort((a, b) => a - b); // Keep a sorted version for required searches
        displayArray(array); // Display original array
        displayArrayAsNumbers(array);
        document.getElementById('search-output').textContent = ''; // Clear search result
    }
}

// Fetch custom array input from the user
function getCustomArray() {
    const customArray = document.getElementById('customArray').value;
    if (customArray) {
        array = customArray.split(',').map(Number).filter(num => !isNaN(num));
        sortedArray = [...array].sort((a, b) => a - b); // Keep a sorted version for required searches
        displayArray(array);
        displayArrayAsNumbers(array);
    }
}

// Display the array as bars
function displayArray(arr) {
    const container = document.getElementById("array-container");
    container.innerHTML = '';
    arr.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${value}px`;
        container.appendChild(bar);
    });
}

// Display the array as numbers
function displayArrayAsNumbers(arr, finalIndex = -1) {
    const numberOutput = document.getElementById("array-output");
    let arrayString = arr.map((value, index) => {
        return index === finalIndex ? `<span class="final-highlight">${value}</span>` : value;
    }).join(', ');
    numberOutput.innerHTML = `Array: ${arrayString}`;
}

// Function to pause execution for visualization
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Highlight a specific bar during search
function highlightBar(index, isFinalHighlight = false, isFound = false) {
    const bars = document.getElementsByClassName('array-bar');
    if (bars[index]) {
        if (isFound) {
            bars[index].classList.add("persistent-highlight"); // Add persistent yellow highlight for found element
        } else {
            bars[index].classList.add(isFinalHighlight ? "final-highlight" : "highlight");
        }
        if (!isFinalHighlight && !isFound) {
            setTimeout(() => bars[index].classList.remove("highlight"), speed * 20);
        }
    }
}

// Perform search based on selected algorithm
async function searchArray() {
    const target = parseInt(document.getElementById("searchTarget").value);
    if (isNaN(target)) return alert("Please enter a valid number to search.");

    const algorithm = document.getElementById("algorithm").value;
    let foundIndex = -1;
    let arrayToUse = array; // Default to unsorted array

    // Choose array to display and use based on algorithm
    if (["binarySearch", "jumpSearch", "exponentialSearch"].includes(algorithm)) {
        arrayToUse = sortedArray;
        displayArray(sortedArray); // Show sorted array if needed
        displayArrayAsNumbers(sortedArray);
    } else {
        displayArray(array); // Show unsorted array for linear search
        displayArrayAsNumbers(array);
    }

    switch (algorithm) {
        case "linearSearch":
            foundIndex = await linearSearch(target, arrayToUse);
            break;
        case "binarySearch":
            foundIndex = await binarySearch(target, arrayToUse);
            break;
        case "jumpSearch":
            foundIndex = await jumpSearch(target, arrayToUse);
            break;
        case "exponentialSearch":
            foundIndex = await exponentialSearch(target, arrayToUse);
            break;
        default:
            foundIndex = await aiPickSearch(target);
    }

    if (foundIndex !== -1) {
        document.getElementById('search-output').textContent = `Number ${target} found at index ${foundIndex}.`;
        highlightBar(foundIndex, false, true); // Highlight the found bar in yellow
    } else {
        document.getElementById('search-output').textContent = `Number ${target} not found.`;
    }
}

// Linear Search Algorithm
async function linearSearch(target, arr) {
    for (let i = 0; i < arr.length; i++) {
        highlightBar(i);
        if (arr[i] === target) {
            highlightBar(i, true);
            displayArrayAsNumbers(arr, i); // Keep final highlight in number format
            return i;
        }
        displayArrayAsNumbers(arr);
        await sleep(speed * 20);
    }
    return -1;
}

// Binary Search Algorithm (requires sorted array)
async function binarySearch(target, arr) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        highlightBar(mid);
        if (arr[mid] === target) {
            highlightBar(mid, true);
            displayArrayAsNumbers(arr, mid);
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        displayArrayAsNumbers(arr);
        await sleep(speed * 20);
    }
    return -1;
}

// Jump Search Algorithm (requires sorted array)
async function jumpSearch(target, arr) {
    let step = Math.floor(Math.sqrt(arr.length));
    let prev = 0;

    while (arr[Math.min(step, arr.length) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(arr.length));
        if (prev >= arr.length) return -1;
    }

    for (let i = prev; i < Math.min(step, arr.length); i++) {
        highlightBar(i);
        if (arr[i] === target) {
            highlightBar(i, true);
            displayArrayAsNumbers(arr, i);
            return i;
        }

        displayArrayAsNumbers(arr);
        await sleep(speed * 20);
    }
    return -1;
}

// Exponential Search Algorithm (requires sorted array)
async function exponentialSearch(target, arr) {
    if (arr[0] === target) {
        highlightBar(0, true);
        displayArrayAsNumbers(arr, 0);
        return 0;
    }

    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        highlightBar(i);
        i *= 2;
        displayArrayAsNumbers(arr);
        await sleep(speed * 20);
    }

    // Binary search in the range found by exponential search
    let left = Math.floor(i / 2);
    let right = Math.min(i, arr.length - 1);

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        highlightBar(mid);
        if (arr[mid] === target) {
            highlightBar(mid, true);
            displayArrayAsNumbers(arr, mid);
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        displayArrayAsNumbers(arr);
        await sleep(speed * 20);
    }
    return -1;
}

// AI picks the best search algorithm based on array characteristics
async function aiPickSearch(target) {
    const size = array.length;
    const isSorted = checkIfSorted(array);
    let arrayToUse = array;

    // Choose algorithm and set array to use/display
    if (size < 20) {
        displayArray(array);
        displayArrayAsNumbers(array);
        return await linearSearch(target, array);
    } else if (isSorted || size > 100) {
        arrayToUse = sortedArray;
        displayArray(sortedArray);
        displayArrayAsNumbers(sortedArray);
        return await binarySearch(target, sortedArray); // Use binary for sorted or large arrays
    } else {
        displayArray(array);
        displayArrayAsNumbers(array);
        return await linearSearch(target, array);
    }
}

// Helper function to check if the array is sorted
function checkIfSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
    }
    return true;
}
