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
            cell.maxLength = 1;

            const value = grid.grid[row][col];

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

            gridElement.appendChild(cell);
        }
    }
}

newGameButton.addEventListener("click", startGame);

startGame();