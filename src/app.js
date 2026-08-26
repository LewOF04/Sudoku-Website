import {generateSudoku} from "../src/generate_sudoku.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");
const numpad = document.getElementById("numpad");

let selectedCell = null;
let currentGrid = null;
let solutionGrid = null;

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
    if (event.target.tagName === "BUTTON" && selectedCell !== 0) {
        if(event.target.textContent === "X") selectedCell.value = "";
        else selectedCell.value = event.target.textContent;

        updateGrid(selectedCell);
        checkPlacement(selectedCell);
    }
});

function startGame() {
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
    console.log("Validity Check");
    let rowInfo = currentGrid.getRow(cell.dataset.row);
    let columnInfo = currentGrid.getColumn(cell.dataset.col);

    //let gridNum = cell.dataset.col + (3 * cell.dataset.row);
    let gridNum = Math.floor(cell.dataset.row / 3) * 3 + Math.floor(cell.dataset.col / 3);
    console.log("Column Num = "+cell.dataset.col + " Row Num = "+cell.dataset.row + " Grid Num = "+gridNum);
    let gridInfo = currentGrid.get3x3Grid(gridNum);

    setValidColour(rowInfo.positions, true);
    setValidColour(columnInfo.positions, true);
    setValidColour(gridInfo.positions, true);

    let returnVal = true;
    if(arrayHasDuplicates(rowInfo.values)){
        console.log("Row has duplicates = "+rowInfo.values.toString());
        setValidColour(rowInfo.positions, false);
        returnVal = false;
    }

    if(arrayHasDuplicates(columnInfo.values)){
        console.log("Column has duplicates = "+columnInfo.values.toString());
        setValidColour(columnInfo.positions, false);
        returnVal = false;
    } 

    if(arrayHasDuplicates(gridInfo.values)){
        console.log("Grid has duplicates = "+gridInfo.values.toString());
        setValidColour(gridInfo.positions, false);
        returnVal = false;
    }

    return returnVal;
}

function setValidColour(positions, isValid){
    console.log("Setting Valid Colour");
    let cellToColour = null;
    if(isValid){
        console.log("Cell is valid");
        for(let i = 0; i < positions.length; i++){
            cellToColour = cellReferences[positions[i].row][positions[i].col];
            cellToColour.classList.remove("invalid");
        }
    } else{
        console.log("Cell is invalid");
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

newGameButton.addEventListener("click", startGame);

startGame();