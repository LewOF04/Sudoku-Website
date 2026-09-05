let startTime = 0;
let elapsedSeconds = 0;
let timerInterval = null;
let isRunning = false;

/**
 * Format given time in seconds into hours, minutes and seconds
 * @param {*} seconds 
 * @returns 
 */
export function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return (
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0')
    );
}

/**
 * Reset the timer to 00:00:00
 * @param {*} display 
 */
export function resetTimer(display){
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedSeconds = 0;
    display.textContent = "00:00:00";
    isRunning = false;
}

/**
 * Toggle the timer between playing and not playing
 * @param {*} display 
 * @returns 
 */
export function toggleTimer(display) {
    if (isRunning) {
        stopTimer();
        isRunning = false;
        return false;
    }

    startTimer(display);
    isRunning = true;
    return true;
}

/**
 * Start the timer upon toggle
 * @param {*} display 
 * @returns 
 */
function startTimer(display){
    if (timerInterval) return;
    isRunning = true;

    startTime = Date.now() - (elapsedSeconds * 1000);
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        display.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

/**
 * Gets the current time on the timer
 * @returns {hours, minutes, seconds}
 */
export function getTime(){
    let totalSecs = elapsedSeconds;

    let hrs = Math.floor(totalSecs / 3600);
    let mins = Math.floor((totalSecs % 3600) / 60);
    let secs = totalSecs % 60;

    return {hours: hrs, minutes: mins, seconds: secs};
}

/**
 * Stop the timer upon toggle
 */
function stopTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

/**
 * Check to whether or not the timer is running
 * @returns 
 */
export function timerRunning(){
    return isRunning;
}