import {generateSudoku} from "../src/generate_sudoku.js";
import {toggleTimer, resetTimer, timerRunning} from "./timer.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");
const numpad = document.getElementById("numpad");

let selectedCell = null;
let currentGrid = null;
let solutionGrid = null;

const timerDisplay = document.getElementById("timer-display");
const playPauseBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
let gameStarted = false;

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

    } else{
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");

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
    }
});

function loadGame() {
    let difficulty = difficultySelect.value;
    let clueNum = -1;

    switch(difficulty){
        case "expert" : clueNum = 20; break;
        case "hard" : clueNum = 27; break;
        case "medium" : clueNum = 35; break;
        case "easy" : clueNum = 40; break;
        default : clueNum = 50;
    }
    const puzzle = generateSudoku(clueNum);
    currentGrid = puzzle.startGrid;
    solutionGrid = puzzle.solution;

    displayGrid(puzzle.startGrid);

    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    gameStarted = false;
    gridElement.classList.remove("paused");

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
                checkValidity(input);
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

    //let gridNum = cell.dataset.col + (3 * cell.dataset.row);
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

loadGame();