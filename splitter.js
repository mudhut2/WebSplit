// Variables to store timer state
let startTime = 0;
let updatedTime = 0;
let difference = 0;
let running = false;
let timerInterval = null;
let splits = [];
let splitCounter = 0;
let splitsBeforeStop = -1;

// Select DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const splitButton = document.getElementById('split');
const resetButton = document.getElementById('reset');
const splitsList = document.getElementById('splits');
const addSplitButton = document.getElementById('add-split');
const removeSplitButton = document.getElementById('remove-split');

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

// Save split time and stop when the limit is reached
function saveSplit() {
    if (splits.length >= splitsBeforeStop) {
        stopTimer();
        return;
    }

    const splitTime = formatTime(difference);
    const listItem = splitsList.children[splits.length];

    if (listItem) {
        const splitTimeDisplay = listItem.querySelector('.split-time');
        splitTimeDisplay.textContent = splitTime;
    }

    splits.push(splitTime);
    highlightCurrentSplit(splits.length);
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
    startButton.textContent = "Start";
    splitButton.disabled = true;
    resetButton.disabled = true;

    timerDisplay.textContent = "00:00:00";
    difference = 0;
    splitCounter = 1;
    
    splits = [];
    splitsList.innerHTML = '';

    addManualSplit();

}

// Add a new split slot
function addManualSplit() {
    splitsBeforeStop++;
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

    // Update the split counter
    splitCounter = splitsList.children.length;

    // Display the first split if it's the first time
    if (splitsList.children.length === 1) {
        document.getElementById('first-split').innerText = `First Split: ${splitTime}`;
    }
}

// Remove last split
function removeLastSplit() {
    if (!running && splitsList.lastChild) {
        splitsList.removeChild(splitsList.lastChild);
        splits.pop();
    }
}

// Highlight current split
function highlightCurrentSplit(index) {
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('current-split');
    });

    const splits = document.querySelectorAll('.list-group-item');
    if (splits[index - 1]) {
        splits[index - 1].classList.add('current-split');
    }
}

// Event listeners
startButton.addEventListener('click', toggleTimer);
splitButton.addEventListener('click', saveSplit);
resetButton.addEventListener('click', resetTimer);
addSplitButton.addEventListener('click', addManualSplit);
removeSplitButton.addEventListener('click', removeLastSplit);

// Initialize on page load
window.addEventListener('load', function () {
    addManualSplit();
});
