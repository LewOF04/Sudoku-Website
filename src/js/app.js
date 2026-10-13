import {generateSudoku, calcClueNum} from "./generate_sudoku.js";
import {toggleTimer, resetTimer, timerRunning, getTime, formatTime} from "./timer.js";
import {getScore} from "./ranking_system.js";
import {GameInfo} from "./data_structs.js";
import {addGame} from "./data_storage.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");
const numpad = document.getElementById("numpad");
const message = document.getElementById("dynamic-jump");

let selectedCell = null;
let startGrid = null;
let currentGrid = null;
let solutionGrid = null;

const timerDisplay = document.getElementById("timer-display");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const gameCompleteOverlay = document.getElementById("game-complete-overlay");
const overlayNewGameButton = document.getElementById("new-game-popup");
const closePopupButton = document.getElementById("close-popup");
let gameStarted = false;

const noteModeButton = document.getElementById("note-mode");
let noteMode = false;
let notes = Array.from(
    {length: 9},
    () => Array.from(
        {length: 9},
        () => new Set()
    )
); //notes store

let errors = 0;
let difficulty = "";

const cellReferences = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null]
];

/**
* Controls clicking of number pad
*/
numpad.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") return;
    enterNumber(selectedCell, event.target.textContent.trim());
});
numpad.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) {
        event.preventDefault();
    }
});

/**
 * Controls start and stop of timer
 */
playPauseBtn.addEventListener("click",  () => {
    const timerOn = toggleTimer(timerDisplay);
    if(timerOn){
        gameStarted = true;
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");

        gridElement.classList.remove("paused");
        numpad.classList.remove("paused");
        message.classList.add("paused");

    } else{
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        message.classList.remove("paused");

        if(gameStarted) {
            gridElement.classList.add("paused");
            numpad.classList.add("paused");
        }
    }
});

newGameButton.addEventListener("click", loadGame); //performs load game upon new game selection

overlayNewGameButton.addEventListener("click", () => {
    hideEndOverlay();
    loadGame();
});

closePopupButton.addEventListener("click", () => {
    hideEndOverlay();
});

/**
 * Listener for when the grid is selected initially.
 * Controls the timer from the point of selection
 */
gridElement.addEventListener("click", () => {
    if (!gameStarted) {
        toggleTimer(timerDisplay);

        gameStarted = true;

        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");

        gridElement.classList.remove("paused");
        numpad.classList.remove("paused");
        message.classList.add("paused");
    }
});

/**
 * Event listener for change between note mode
 */
noteModeButton.addEventListener("click", () => {
    noteMode = !noteMode;

    noteModeButton.classList.toggle("active", noteMode);

    noteModeButton.setAttribute("aria-pressed", String(noteMode));

    noteModeButton.textContent = noteMode
        ? "Notes: On"
        : "Notes: Off";
});

function updateNotesDisplay(row, col) {
    const cell = cellReferences[row][col];
    const noteGrid = cell.parentElement.querySelector(".cell-notes");
    [...noteGrid.children].forEach((span, i) => {
        span.textContent = notes[row][col].has(i + 1) ? String(i + 1) : "";
    });
}

/**
 * Handles number entering logic 
 * @param {*} cell - the cell which we're entering the number into
 * @param {*} value - the value which we're entering into the cell
 * @returns - early returns for logic flow
 */
function enterNumber(cell, value) {
    //ensure the cell can currently be edited
    if (!cell || cell.readOnly || gridElement.classList.contains("paused")) return;

    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);

    //only accept 1-9 or X
    if (!/^[1-9]$/.test(value) && value !== "X") return;

    //NOTES MODE
    if (noteMode) {
        if (value === "X") {
            notes[row][col].clear();
        }
        else if (currentGrid.grid[row][col] == 0) {
            const number = Number(value);

            if (notes[row][col].has(number)) {
                notes[row][col].delete(number);
            }
            else {
                notes[row][col].add(number);
            }
        }

        updateNotesDisplay(row, col);
        return;
    }

    //NORMAL MODE
    const newValue = value === "X" ? "" : value;

    cell.value = newValue;
    cell.dataset.previousValue = newValue || "0";

    //clear notes for this cell
    notes[row][col].clear();
    updateNotesDisplay(row, col);

    //update the actual Sudoku grid
    updateGrid(cell);
    //check placement and completion
    if (checkValidity(cell)) {
        checkSubCompletion(cell);
        checkCompletion();
    }
}

/**
 * Reset sudoku grid based on player selection
 */
function loadGame() {
    difficulty = difficultySelect.value;
    selectedCell = null;
    notes = Array.from({length: 9}, () => Array.from({length: 9}, () => new Set()));

    let clueNum = calcClueNum(difficulty);
    
    const puzzle = generateSudoku(clueNum);
    startGrid = puzzle.startGrid.copy();
    currentGrid = puzzle.startGrid;
    solutionGrid = puzzle.solution;

    displayGrid(puzzle.startGrid);
    console.log(solutionGrid.toString());

    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    gameStarted = false;
    errors = 0;
    gridElement.classList.remove("paused");
    message.classList.remove("paused");
    numpad.classList.remove("paused");
    playPauseBtn.classList.remove("paused");
    timerDisplay.classList.remove("paused");

    resetTimer(timerDisplay);
}

/**
 * Given a grid, display this grid onto the website and establish cell listeners
 * @param {*} grid 
 */
function displayGrid(grid) {
    gridElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("input");

            cell.type = "text";
            cell.placeholder = "";
            const isTouchDevice =
                window.matchMedia("(pointer: coarse)").matches ||
                navigator.maxTouchPoints > 0;

            cell.inputMode = isTouchDevice ? "none" : "numeric";

            const value = grid.grid[row][col];
            cell.dataset.row = row;
            cell.dataset.col = col;
            cellReferences[row][col] = cell;

            cell.dataset.previousValue = 0;

            if (value !== 0) {
                cell.value = value;
                cell.readOnly = true;
                cell.classList.add("given");
            }
            
            //add event listener for last selected cell
            cell.addEventListener("pointerdown", () => {
                if (cell.readOnly) return;

                //remove highlight from previously selected cell
                if (selectedCell) {
                    selectedCell.parentElement.classList.remove("selected");
                }

                //store the newly selected cell
                selectedCell = cell;

                //highlight the newly selected cell
                cell.parentElement.classList.add("selected");
            });

            //event upon cell alteration
            cell.addEventListener("keydown", (event) => {
                if (/^[1-9]$/.test(event.key)) {
                    event.preventDefault();
                    enterNumber(cell, event.key);
                }
                else if (event.key === "Backspace" || event.key === "Delete") {
                    event.preventDefault();
                    enterNumber(cell, "X");
                }
                else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
                    event.preventDefault();
                }
            });

            const wrapper = document.createElement("div");
            wrapper.className = "sudoku-cell";
            if(cell.readOnly) wrapper.classList.add("given");
            const noteGrid = document.createElement("div");
            noteGrid.className = "cell-notes";
            for(let n = 1; n <= 9; n++) noteGrid.appendChild(document.createElement("span"));
            wrapper.appendChild(noteGrid);
            wrapper.appendChild(cell);
            gridElement.appendChild(wrapper);
        }
    }
}

/**
 * After placement, update the backend grid to reflect the change
 * @param {} cell 
 */
function updateGrid(cell){
    let value = 0;
    if(cell.value != "") value = parseInt(cell.value);
    currentGrid.updateGrid(cell.dataset.row, cell.dataset.col, value);

    console.log("New Grid:\n"+currentGrid.toString());
}

/**
 * Ater a new cell input, check whether that cell placement was valid
 * Increments error counter upon invalid placement
 * @param {} cell 
 * @returns - false if invalid, true if valid
 */
function checkValidity(cell){
    let rowInfo = currentGrid.getRow(cell.dataset.row);
    let columnInfo = currentGrid.getColumn(cell.dataset.col);

    let gridNum = Math.floor(cell.dataset.row / 3) * 3 + Math.floor(cell.dataset.col / 3);
    let gridInfo = currentGrid.get3x3Grid(gridNum);

    setValidColour(rowInfo.positions, true);
    setValidColour(columnInfo.positions, true);
    setValidColour(gridInfo.positions, true);

    let returnVal = true;
    if(arrayHasDuplicates(rowInfo.values)){
        setValidColour(rowInfo.positions, false);
        returnVal = false;
    }

    if(arrayHasDuplicates(columnInfo.values)){
        setValidColour(columnInfo.positions, false);
        returnVal = false;
    } 

    if(arrayHasDuplicates(gridInfo.values)){
        setValidColour(gridInfo.positions, false);
        returnVal = false;
    }

    if(!returnVal){
        errors++;
    }
    return returnVal;
}

/**
 * Check after cell input whether the row, column or 3x3 grid has been completed.
 * If so, play completion animation.
 * @param {*} cell - the cell which has been added
 */
function checkSubCompletion(cell){
    let rowInfo = currentGrid.getRow(cell.dataset.row);
    let columnInfo = currentGrid.getColumn(cell.dataset.col);

    let gridNum = Math.floor(cell.dataset.row / 3) * 3 + Math.floor(cell.dataset.col / 3);
    let gridInfo = currentGrid.get3x3Grid(gridNum);

    if(arrayIsComplete(rowInfo.values)){
        flashCells(cell, rowInfo.positions, "row");
    }
    if(arrayIsComplete(columnInfo.values)){
        flashCells(cell, columnInfo.positions, "column");
    }
    if(arrayIsComplete(gridInfo.values)){
        flashCells(cell, gridInfo.positions, "grid");
    }
}

function checkCompletion(){
    if(currentGrid.getFilledCellNum() == 81){ //if the whole grid is filled
        //pulse all cells
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                let cell = cellReferences[i][j];
                pulseCell(cell, 0);
            }
        }

        toggleTimer(); //stop the timer

        //alter play icon
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
        pauseIcon.classList.add("paused");

        showEndOverlay(); //show end game overlay

        saveCompletedGame();
    }
}

/**
 * Given a set of cells and whether those cells are validly filled, change the colours between red and default white.
 * @param {*} positions 
 * @param {*} isValid 
 */
function setValidColour(positions, isValid) {
    for (const position of positions) {
        const cell = cellReferences[position.row][position.col];
        const wrapper = cell.parentElement;

        wrapper.classList.toggle("invalid", !isValid);
    }
}

/**
 * Check whether a given array has duplicates or not
 * @param {*} array - the array to check
 * @returns - true if has duplicates, false if not
 */
function arrayHasDuplicates(array){
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array.length; j++){
            if(i == j || array[i] == 0 || array[j] == 0) continue;
            
            if(array[i] == array[j]) return true;
        }
    }
    return false;
}

/**
 * Check whether a given array has exactly 9 non zero values
 * @param {*} array 
 * @returns - true if has 9 non-zero values, false if else
 */
function arrayIsComplete(array){
    let validNum = 0;
    for(let i = 0; i < array.length; i++){
        if(array[i] != 0) validNum++;
    }

    if(validNum == 9) return true;

    return false;
}

/**
 * Given a start cell and a set of neighbouring cells and what type of area has been completed,
 * flash the cells in sequence to show completion.
 * @param {*} startCell 
 * @param {*} allCells 
 * @param {*} type 
 */
function flashCells(startCell, allCells, type) {
    const startRow = Number(startCell.dataset.row);
    const startCol = Number(startCell.dataset.col);

    for (let i = 0; i < allCells.length; i++) {
        const row = allCells[i].row;
        const col = allCells[i].col;

        let distance = 0;

        if (type === "row") {
            distance = Math.abs(col - startCol);
        }
        else if (type === "column") {
            distance = Math.abs(row - startRow);
        }
        else if (type === "grid") {
            distance = 0;
        }

        const cell = cellReferences[row][col];

        pulseCell(cell, distance);
    }
}

/**
 * Pulse cell with delay based on distance from starting cell point
 * @param {*} cell 
 * @param {*} distance 
 */
function pulseCell(cell, distance) {
    const delay = distance * 100;
    const wrapper = cell.parentElement;

    setTimeout(() => {
        wrapper.classList.remove("pulse");

        // Restart the animation if triggered again
        void wrapper.offsetWidth;

        wrapper.classList.add("pulse");

        wrapper.addEventListener("animationend", () => {
            wrapper.classList.remove("pulse");
        }, { once: true });

    }, delay);
}

/**
 * Shown the end of comlpeting a sudoku end screen
 */
function showEndOverlay(){
    gridElement.classList.add("paused");
    numpad.classList.add("paused");
    playPauseBtn.classList.add("paused");
    timerDisplay.classList.add("paused");

    let score = getScore(difficulty, errors);
    let time = getTime(); 

    document.getElementById("final-difficulty").textContent = String(difficulty).charAt(0).toUpperCase() + String(difficulty).slice(1);
    document.getElementById("final-errors").textContent = errors.toString();
    document.getElementById("final-time").textContent = formatTime(time.hours*60*60+time.minutes*60+time.seconds);
    document.getElementById("final-score").textContent = score.toFixed(2);

    gameCompleteOverlay.classList.remove("hidden");
}

/**
 * Upon game completion save the game to the users files (if they have one)
 */
function saveCompletedGame(){
    let score = getScore(difficulty, errors);
    let time = getTime();

    let gameInfo = new GameInfo(startGrid.grid, currentGrid.grid, difficulty, 
                                formatTime(time.hours*60*60+time.minutes*60+time.seconds), errors, score, true);
    
    addGame(gameInfo);
}

function hideEndOverlay(){
    gameCompleteOverlay.classList.add("hidden");
}

loadGame();