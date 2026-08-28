let startTime = 0;
let elapsedSeconds = 0;
let timerInterval = null;
let isRunning = false;

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return (
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0')
    );
}

export function resetTimer(display){
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedSeconds = 0;
    display.textContent = "00:00:00";
    isRunning = false;
}

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

function startTimer(display){
    if (timerInterval) return;
    isRunning = true;

    startTime = Date.now() - (elapsedSeconds * 1000);
    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        display.textContent = formatTime(elapsedSeconds);
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

export function timerRunning(){
    return isRunning;
}