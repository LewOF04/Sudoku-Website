import {generateSudoku} from "../src/generate_sudoku.js";

const gridElement = document.getElementById("sudoku-grid");
const newGameButton = document.getElementById("new-game");

function startGame() {
    const puzzle = generateSudoku(30);

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

            gridElement.appendChild(cell);
        }
    }
}

newGameButton.addEventListener("click", startGame);

startGame();