import {generateSudoku} from "../src/generate_sudoku.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");
const difficultySelect = document.getElementById("difficulty");
const numpad = document.getElementById("numpad");

let selectedCell = null;
let currentGrid = null;
let solutionGrid = null;

numpad.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON" && selectedCell !== null) {
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
    console.log("Function entered");
    if(cell.value != "") value = parseInt(cell.value);
    console.log("cell.value = \"\" checked");
    currentGrid[cell.dataset.row][cell.dataset.col] = value;
}

function checkValidity(cell){

}

newGameButton.addEventListener("click", startGame);

startGame();