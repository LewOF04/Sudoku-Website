import {generateSudoku} from "../src/generate_sudoku.js";
import {toggleTimer, resetTimer, timerRunning} from "./timer.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");
const numpad = document.getElementById("numpad");
const message = document.getElementById("dynamic-jump");

let selectedCell = null;
let currentGrid = null;
let solutionGrid = null;

const timerDisplay = document.getElementById("timer-display");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
let gameStarted = false;

let errors = 0;

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

numpad.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && selectedCell !== null) {
        if(event.target.textContent === "X") selectedCell.value = "";
        else selectedCell.value = event.target.textContent;

        updateGrid(selectedCell);
        checkValidity(selectedCell);
    }
});

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

newGameButton.addEventListener("click", loadGame);

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

function loadGame() {
    let difficulty = difficultySelect.value;
    let min = -1;
    let max = -1;

    switch(difficulty){
        case "impossible" : max = 21; min = 17; break;
        case "expert" : max = 25; min = 22; break;
        case "hard" : max = 29; min = 26; break;
        case "medium" : max = 35; min = 30; break;
        case "easy" : max = 44; min = 36; break;
        default : max = 50; min = 45;
    }
    let clueNum = Math.floor(Math.random() * (max - min) + min);
    const puzzle = generateSudoku(clueNum);
    currentGrid = puzzle.startGrid;
    solutionGrid = puzzle.solution;

    displayGrid(puzzle.startGrid);
    console.log(solutionGrid.toString());

    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    gameStarted = false;
    gridElement.classList.remove("paused");
    message.classList.remove("paused");

    resetTimer(timerDisplay);
}

function displayGrid(grid) {
    gridElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("input");

            cell.type = "text";

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
            cell.addEventListener("click", () => {
                if (!cell.readOnly) {
                    selectedCell = cell;
                }
            });

            cell.addEventListener("input", (event) => {
                const input = event.target;
                
                //limit to only the latest character
                if (input.value.length > 1) {
                    input.value = input.value.slice(-1);
                }

                // Only allow "" or 1-9
                if (!/^[1-9]?$/.test(input.value)) {
                    if(input.dataset.previousValue == 0) input.value = ""; //set to nothing
                    else input.value = input.dataset.previousValue; //retain the previous number
                }
                
                input.dataset.previousValue = input.value;

                updateGrid(input);
                if(checkValidity(input)){
                    checkCompletion(input);
                }
            });

            gridElement.appendChild(cell);
        }
    }
}

function updateGrid(cell){
    let value = 0;
    if(cell.value != "") value = parseInt(cell.value);
    currentGrid.grid[cell.dataset.row][cell.dataset.col] = value;

    console.log("New Grid:\n"+currentGrid.toString());
}

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

    return returnVal;
}

function checkCompletion(cell){
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

function setValidColour(positions, isValid){
    let cellToColour = null;
    if(isValid){
        for(let i = 0; i < positions.length; i++){
            cellToColour = cellReferences[positions[i].row][positions[i].col];
            cellToColour.classList.remove("invalid");
        }
    } else{
        for(let i = 0; i < positions.length; i++){
            cellToColour = cellReferences[positions[i].row][positions[i].col];
            cellToColour.classList.add("invalid");
        }
    }
}

function arrayHasDuplicates(array){
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array.length; j++){
            if(i == j || array[i] == 0 || array[j] == 0) continue;
            
            if(array[i] == array[j]) return true;
        }
    }
    return false;
}

function arrayIsComplete(array){
    let validNum = 0;
    for(let i = 0; i < array.length; i++){
        if(array[i] != 0) validNum++;
    }

    if(validNum == 9) return true;

    return false;
}

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

function pulseCell(cell, distance){
    const delay = distance * 100;

    setTimeout(() => {
        cell.classList.add("pulse");

        cell.addEventListener("animationend", () => {
            cell.classList.remove("pulse");
        }, { once: true });

    }, delay);
}

loadGame();