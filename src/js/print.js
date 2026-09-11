import {generateSudoku, calcClueNum} from "./generate_sudoku.js";

const preview = document.getElementById("print-preview");
const generateButton = document.getElementById("generate-print");
const printButton = document.getElementById("print-button");
const printControls = document.getElementById("print-controls");

generateButton.addEventListener("click", generatePrintSudokus);

printButton.addEventListener("click", () => {
    window.print();
});

/**
 * Iterate over all possible difficulties and create sudoku grids for each difficulty and the number specified.
 */
function generatePrintSudokus() {
    preview.innerHTML = "";

    const requestedSudokus = [];

    const difficulties = [
        "beginner",
        "easy",
        "medium",
        "hard",
        "expert",
        "impossible"
    ];

    for (const difficulty of difficulties) {
        const count = document.getElementById(`${difficulty}-count`);
        const amount = Math.max(0, parseInt(count.value) || 0);

        for (let i = 0; i < amount; i++) {
            const clueNum = calcClueNum(difficulty); //calculate the number of clues for the puzzle
            const puzzle = generateSudoku(clueNum); //create sudoku grid
            requestedSudokus.push({difficulty: difficulty, grid: puzzle.startGrid}); //add to the requested sudokus
        }
    }

    //if there are no sudokus, don't show print option
    if (requestedSudokus.length === 0) {
        printControls.classList.add("hidden");
        return;
    }

    createPages(requestedSudokus); //create the sub-pages for printing purposes

    printControls.classList.remove("hidden");
}

/**
 * Create sub-pages for 2-per-page sudoku printing
 * @param {*} sudokus - list of sudokus which are to be printed
 */
function createPages(sudokus) {
    for (let i = 0; i < sudokus.length; i += 2) {
        const page = document.createElement("div"); //create a sub-page div
        page.classList.add("print-page"); 

        page.appendChild(createPrintSudoku(sudokus[i])); //add formatted sudoku grid

        if (sudokus[i + 1]) {page.appendChild(createPrintSudoku(sudokus[i + 1]));} //if there is another sudoku, also add

        preview.appendChild(page); //add to view
    }
}

/**
 * Wrapper function for each individual sudoku grid element
 * @param {*} sudoku - the sudoku we wish to display
 * @returns - the complete wrapper with the internally defined sudoku grid
 */
function createPrintSudoku(sudoku) {
    const wrapper = document.createElement("div");

    wrapper.classList.add("print-sudoku");
    wrapper.appendChild(createPrintGrid(sudoku.grid));

    return wrapper;
}

/**
 * Defines individual sudoku grid layout
 * @param {*} grid - the grid we wish to define
 * @returns - designed sudoku grid
 */
function createPrintGrid(grid) {
    const gridElement = document.createElement("div");
    gridElement.classList.add("print-grid");

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("print-cell");

            const value = grid.grid[row][col];

            if (value !== 0) {
                cell.textContent = value;
                cell.classList.add("given");
            }

            gridElement.appendChild(cell);
        }
    }
    return gridElement;
}