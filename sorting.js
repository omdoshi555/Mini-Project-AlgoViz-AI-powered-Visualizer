let array = [];
let speed = 5;

// Listen for speed input change
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
        displayArray();
        displayArrayAsNumbers(); // Show array as numbers
        document.getElementById('runtime').textContent = '';  // Clear runtime display
    }
}

// Fetch custom array input from the user
function getCustomArray() {
    const customArray = document.getElementById('customArray').value;
    if (customArray) {
        array = customArray.split(',').map(Number).filter(num => !isNaN(num));
        displayArray(); // Display custom array visually
        displayArrayAsNumbers(); // Show custom array as numbers
    }
}

// Display the array as bars
function displayArray() {
    const container = document.getElementById("array-container");
    container.innerHTML = '';  // Clear previous array
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${value}px`;
        container.appendChild(bar);
    });
}

// Display the array as numbers
function displayArrayAsNumbers() {
    const numberOutput = document.getElementById("array-output");
    numberOutput.textContent = `Array: ${array.join(', ')}`;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sort array based on selected algorithm
async function sortArray() {
    getCustomArray();  // Get the custom array if provided
    const algorithm = document.getElementById("algorithm").value;
    const start = performance.now();

    switch (algorithm) {
        case "bubbleSort":
            await bubbleSort(array);
            break;
        case "mergeSort":
            array = await mergeSort(array);
            break;
        case "quickSort":
            await quickSort(array, 0, array.length - 1);
            break;
        case "insertionSort":
            await insertionSort(array);
            break;
        default:
            const chosenAlgo = aiPickAlgorithm(array);
            await chosenAlgo(array);
    }

    const end = performance.now();
    
    displayArray(); // Display sorted array as bars
    displayArrayAsNumbers(); // Display sorted array as numbers
}

// AI picks the best algorithm
function aiPickAlgorithm(arr) {
    const size = arr.length;
    const randomness = calculateRandomness(arr);

    if (size < 20) return bubbleSort; // Directly use bubble sort for small arrays

    if (randomness > 0.7) return quickSort;
    return mergeSort;
}

// Calculate array randomness
function calculateRandomness(arr) {
    let disorder = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) disorder++;
    }
    return disorder / arr.length;
}

// Bubble Sort
async function bubbleSort(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                displayArray();
                displayArrayAsNumbers(); // Update array as numbers after each swap
                await sleep(speed * 20);
            }
        }
    }
}

// Merge Sort
async function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await mergeSort(arr.slice(0, mid));
    const right = await mergeSort(arr.slice(mid));

    return await merge(left, right);
}

async function merge(left, right) {
    let result = [];
    let leftIndex = 0, rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
        array = [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)];
        displayArray();
        displayArrayAsNumbers(); // Update array as numbers after each merge step
        await sleep(speed * 20);
    }

    // Concat remaining elements and display
    result = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    array = result; // Update array with merged result for correct display
    displayArray();
    displayArrayAsNumbers();
    await sleep(speed * 20);

    return result;
}

// Quick Sort
async function quickSort(arr, low, high) {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
    displayArray(); // Final display call to show sorted array in bars
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            displayArray();
            displayArrayAsNumbers(); // Update array as numbers after each partition step
            await sleep(speed * 20);
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    displayArray();
    displayArrayAsNumbers(); // Update array as numbers after pivot swap
    await sleep(speed * 20);
    return i + 1;
}

// Insertion Sort
async function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            displayArray();
            displayArrayAsNumbers(); // Update array as numbers after each key insertion
            await sleep(speed * 20);
        }
        arr[j + 1] = key;
    }
}
