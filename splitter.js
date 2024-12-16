// Variables to store timer state
let startTime = 0;
let updatedTime = 0;
let difference = 0; // Time that has passed since last action (start or split)
let running = false;
let timerInterval = null;
let splits = [];
let splitCounter = 1; // Initialize counter for numbering splits
let splitsBeforeStop = 5; // Default splits before stop

// Select DOM elements
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const splitButton = document.getElementById('split');
const resetButton = document.getElementById('reset');
const splitsList = document.getElementById('splits');
const stopSplitsInput = document.getElementById('splits-before-stop'); // New input element
const saveButton = document.getElementById('save');
const uploadButton = document.getElementById('upload');
const fileInput = document.getElementById('file-input');

// Update the splitsBeforeStop variable whenever the user changes the value
stopSplitsInput.addEventListener('input', function() {
    splitsBeforeStop = parseInt(stopSplitsInput.value) || 5; // Default to 5 if empty or invalid
});

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
        startTime = Date.now() - difference; // Continue from where the timer was paused
        timerInterval = setInterval(updateTimer, 10); // Start updating the timer
        startButton.textContent = "Pause"; // Change the button text to Pause
        splitButton.disabled = false; // Enable the split button
        resetButton.disabled = false; // Enable the reset button
    } else {
        clearInterval(timerInterval); // Stop the timer
        startButton.textContent = "Resume"; // Change the button text to Resume
    }
    running = !running; // Toggle the running state
}

// Update the timer display
function updateTimer() {
    difference = Date.now() - startTime;
    timerDisplay.textContent = formatTime(difference); // Update the displayed time
}

// Split the time and save it
function saveSplit() {
    const splitTime = formatTime(difference);

    // Create list item with flexbox
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'fs-3', 'border', 'border-dark', 'd-flex', 'justify-content-between');

    // Create span for the split number
    const splitNumber = document.createElement('span');
    splitNumber.textContent = `#${splitCounter}`;
    splitNumber.classList.add('split-number');

    // Create span for the split time
    const splitTimeDisplay = document.createElement('span');
    splitTimeDisplay.textContent = splitTime;
    splitTimeDisplay.classList.add('split-time');

    // Append both spans to the list item
    listItem.appendChild(splitNumber);
    listItem.appendChild(splitTimeDisplay);

    // Append list item to the splits list
    splitsList.appendChild(listItem);

    splits.push(splitTime);

    // Increment split counter for next split
    splitCounter++;

    // Check if we've reached the specified number of splits before stopping
    if (splitCounter > splitsBeforeStop) {
        stopTimer(); // Stop the timer when we reach the specified number of splits
    }
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
}

// Save splits as a .json file
function saveSplits() {
    const splitsData = JSON.stringify(splits, null, 2); // Convert splits to JSON

    // Create a Blob with the JSON data
    const blob = new Blob([splitsData], { type: 'application/json' });

    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'splits.json'; // Name of the downloaded file

    // Trigger the download by simulating a click on the link
    link.click();

    alert('Splits saved as splits.json!');
}

// Upload splits (allow user to compare uploaded splits)
function uploadSplits() {
    fileInput.click(); // Trigger the file input dialog
}


// Handle file upload
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadedSplits = JSON.parse(e.target.result);
            compareSplits(uploadedSplits);
        };
        reader.readAsText(file);
    } else {
        alert('Please upload a valid .json file');
    }
});

// Compare current splits with uploaded splits and display them in the splits container
function compareSplits(uploadedSplits) {
    // Clear existing splits
    splitsList.innerHTML = '';

    // Display the uploaded splits
    uploadedSplits.forEach((splitTime, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'fs-3', 'border', 'border-dark', 'd-flex', 'justify-content-between');

        // Create span for the split number
        const splitNumber = document.createElement('span');
        splitNumber.textContent = `#${index + 1}`;
        splitNumber.classList.add('split-number');

        // Create span for the split time
        const splitTimeDisplay = document.createElement('span');
        splitTimeDisplay.textContent = splitTime;
        splitTimeDisplay.classList.add('split-time');

        // Append both spans to the list item
        listItem.appendChild(splitNumber);
        listItem.appendChild(splitTimeDisplay);

        // Append list item to the splits list
        splitsList.appendChild(listItem);
    });


    alert('Splits uploaded and displayed! Reset to clear');
}

// Event listeners
startButton.addEventListener('click', toggleTimer);
splitButton.addEventListener('click', saveSplit);
resetButton.addEventListener('click', resetTimer);
saveButton.addEventListener('click', saveSplits);
uploadButton.addEventListener('click', uploadSplits);

// Initialize with localStorage splits
window.addEventListener('load', function() {
    const storedSplits = JSON.parse(localStorage.getItem('splits'));
    if (storedSplits) {
        splits = storedSplits;
        splitCounter = splits.length + 1; // Start counting splits after the loaded ones
    }
});
