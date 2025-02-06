/* 

*/

// Variables to store timer state
let startTime = 0;
let updatedTime = 0;
let difference = 0; // Time that has passed since last action (start or split)
let running = false;
let timerInterval = null;
let splits = [];
let splitCounter = 1; // Initialize counter for numbering splits
let splitsBeforeStop = 2; // Default splits before stop

// Select DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const splitButton = document.getElementById('split');
const resetButton = document.getElementById('reset');
const splitsList = document.getElementById('splits');
const stopSplitsInput = document.getElementById('splits-before-stop'); // New input element
// const saveButton = document.getElementById('save');
// const uploadButton = document.getElementById('upload');
const fileInput = document.getElementById('file-input');
const addSplitButton = document.getElementById('add-split');
const removeSplitButton = document.getElementById('remove-split');

// Format time into MM:SS:MS format
function formatTime(time) {
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

// Pad single digits with zeroes (e.g., 9 -> 09)
function pad(num) {
    return num < 10 ? `0${num}` : num;
}

// Start or stop the timer
function toggleTimer() {
    if (!running) {
        startTime = Date.now() - difference; // Resume from paused time
        timerInterval = setInterval(updateTimer, 10);
        startButton.textContent = "Pause";
        splitButton.disabled = false;
        resetButton.disabled = false;
    } else {
        clearInterval(timerInterval); // Pause the timer
        difference = Date.now() - startTime; // Store elapsed time before pausing
        startButton.textContent = "Resume";
    }
    running = !running;
}

// Update the timer display
function updateTimer() {
    if (running) {
        difference = Date.now() - startTime;
        timerDisplay.textContent = formatTime(difference);
    } else {
        clearInterval(timerInterval); // Prevents redundant intervals
    }
}

// Split the time and save it
function saveSplit() {
    const splitTime = formatTime(difference);
    // Select the next available list item
    const listItem = splitsList.children[splits.length];
    // Find the split time span and update it
    const splitTimeDisplay = listItem.querySelector('.split-time');
    splitTimeDisplay.textContent = splitTime;
    splits.push(splitTime); // Store split time
    if (splits.length>= splitsList.children.length) {
        stopTimer();
        return;
    }
}

function updateSplitCounter() {
    splitCounter = splitsList.children.length + 1;
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    running = false;
    startButton.textContent = "Start";
    splitButton.disabled = true;
    resetButton.disabled = false; // Allow reset after stopping
}

// Reset the timer and splits
function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    startButton.textContent = "Start";
    splitButton.disabled = true;
    resetButton.disabled = true;
    splitsList.innerHTML = '';
    timerDisplay.textContent = "00:00:00";
    difference = 0;
    splitCounter = 1; // Reset counter when resetting timer
    splits = [];
    splitsBeforeStop = 2;
}

function addManualSplit() {
    splitsBeforeStop++;
    if (splitsList.children.length >= splitsBeforeStop) return; // Limit splits

    const splitTime = "00:00:00"; // Placeholder time

    // Create list item
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'fs-3', 'border', 'border-dark', 'd-flex', 'justify-content-between');

    // Create split number span
    const splitNumber = document.createElement('span');
    splitNumber.textContent = `#${splitsList.children.length + 1}`;
    splitNumber.classList.add('split-number');

    // Create split time span
    const splitTimeDisplay = document.createElement('span');
    splitTimeDisplay.textContent = splitTime;
    splitTimeDisplay.classList.add('split-time');

    // Append to list item
    listItem.appendChild(splitNumber);
    listItem.appendChild(splitTimeDisplay);

    // Append to split list
    splitsList.appendChild(listItem);

    // Display the first split if it's the first time
    if (splitsList.children.length === 1) {
        document.getElementById('first-split').innerText = `First Split: ${splitTime}`;
    }
}

// Function to remove last split
function removeLastSplit() {
    if (running || splits.length === 0) return;

    splitsList.removeChild(splitsList.lastChild);
    splits.pop();
    
    splitCounter = splitsList.children.length + 1; // Correctly recalculate split count
}

document.getElementById('add-split').addEventListener('click', addManualSplit);

document.getElementById('remove-split').addEventListener('click', function() {
    if (splitsList.lastChild) {
        splitsList.removeChild(splitsList.lastChild);
        splits.pop(); // Remove last split from array
        updateSplitCounter();
    }
});

// implement upload and save split functionality 

// Event listeners
startButton.addEventListener('click', toggleTimer);
splitButton.addEventListener('click', saveSplit);
resetButton.addEventListener('click', resetTimer);
//saveButton.addEventListener('click', saveSplits);
//uploadButton.addEventListener('click', uploadSplits);
addSplitButton.addEventListener('click', addManualSplit);
removeSplitButton.addEventListener('click', removeLastSplit);


// Initialize with localStorage splits
window.addEventListener('load', function() {
    const storedSplits = JSON.parse(localStorage.getItem('splits'));
    if (storedSplits) {
        splits = storedSplits;
        splitCounter = splits.length + 1; // Start counting splits after the loaded ones
    }
});
