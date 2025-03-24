// ================================
// VARIABLES
// ================================
let startTime = 0;
let updatedTime = 0;
let difference = 0;
let running = false;
let timerInterval = null;
let splits = [];
let splitCounter = 0;
let splitsBeforeStop = -1;

// DOM ELEMENTS
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const splitButton = document.getElementById('split');
const resetButton = document.getElementById('reset');
const splitsList = document.getElementById('splits');
const addSplitButton = document.getElementById('add-split');
const removeSplitButton = document.getElementById('remove-split');


// ================================
// TIMER FUNCTIONS
// ================================

// Format time into MM:SS:MS format
function formatTime(time) {
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

// Pad single digits with zeroes
function pad(num) {
    return num < 10 ? `0${num}` : num;
}

// Start or stop the timer
function toggleTimer() {
    if (!running) {
        startTime = Date.now() - difference;
        timerInterval = setInterval(updateTimer, 10);
        startButton.textContent = "Pause";
        splitButton.disabled = false;
        resetButton.disabled = false;
    } else {
        clearInterval(timerInterval);
        difference = Date.now() - startTime;
        startButton.textContent = "Resume";
    }
    running = !running;
}

// Update the timer display
function updateTimer() {
    if (running) {
        difference = Date.now() - startTime;
        timerDisplay.textContent = formatTime(difference);
    }
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    running = false;
    startButton.textContent = "Start";
    splitButton.disabled = true;
    resetButton.disabled = false;
}

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    running = false;

    // Reset UI and timer values
    startButton.textContent = "Start";
    splitButton.disabled = true;
    resetButton.disabled = true;
    timerDisplay.textContent = "00:00:00";
    
    difference = 0;
    splitCounter = 0;
    splitsBeforeStop = -1;
    
    splits = [];
    splitsList.innerHTML = '';

    addManualSplit();
}

// ================================
// SPLIT FUNCTIONS
// ================================

// Save the current split time and stop properly on the last split
function saveSplit() {
    const splitTime = formatTime(difference);

    // Add split time to the DOM
    const listItem = splitsList.children[splits.length];

    if (listItem) {
        const splitTimeDisplay = listItem.querySelector('.split-time');
        splitTimeDisplay.textContent = splitTime;
    }

    // Add the split to the array
    splits.push(splitTime);
    highlightCurrentSplit(splits.length);

    // ✅ Correct stopping condition
    if (splits.length > splitsBeforeStop) {  
        stopTimer();
        return;
    }

    
}



// Add a new split slot manually
function addManualSplit() {
    splitsBeforeStop++;
    const splitTime = "00:00:00"; // Placeholder time

    // Create list item
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'fs-3', 'border', 'border-dark', 'd-flex', 'justify-content-between');

    // Split number
    const splitNumber = document.createElement('span');
    splitNumber.textContent = `${splitsList.children.length + 1}`;
    splitNumber.classList.add('split-number');

    // Split time display
    const splitTimeDisplay = document.createElement('span');
    splitTimeDisplay.textContent = splitTime;
    splitTimeDisplay.classList.add('split-time');

    // Append elements
    listItem.appendChild(splitNumber);
    listItem.appendChild(splitTimeDisplay);
    splitsList.appendChild(listItem);

    splitCounter = splitsList.children.length;
}

// Remove the last split
function removeLastSplit() {
    if (!running && splitsList.lastChild) {
        splitsList.removeChild(splitsList.lastChild);
        splits.pop();
    }
}

// Highlight the current split
function highlightCurrentSplit(index) {
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('current-split');
    });

    const splitItems = document.querySelectorAll('.list-group-item');
    if (splitItems[index - 1]) {
        splitItems[index - 1].classList.add('current-split');
    }
}

// ================================
// EVENT LISTENERS
// ================================
startButton.addEventListener('click', toggleTimer);
splitButton.addEventListener('click', saveSplit);
resetButton.addEventListener('click', resetTimer);
addSplitButton.addEventListener('click', addManualSplit);
removeSplitButton.addEventListener('click', removeLastSplit);

// Initialize on page load
window.addEventListener('load', () => addManualSplit());
