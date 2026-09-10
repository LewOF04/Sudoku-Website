import {generateSudoku, calcClueNum} from "./generate_sudoku.js";

const preview = document.getElementById("print-preview");
const generateButton = document.getElementById("generate-print");
const printButton = document.getElementById("print-button");
const printControls = document.getElementById("print-controls");

generateButton.addEventListener("click", generatePrintSudokus);

printButton.addEventListener("click", () => {
    window.print();
});

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
        const input = document.getElementById(`${difficulty}-count`);

        const amount = Math.max(0, parseInt(input.value) || 0);

        for (let i = 0; i < amount; i++) {
            const clueNum = calcClueNum(difficulty);
            const puzzle = generateSudoku(clueNum);
            requestedSudokus.push({difficulty: difficulty, grid: puzzle.startGrid});
        }
    }

    if (requestedSudokus.length === 0) {
        printControls.classList.add("hidden");
        return;
    }

    createPages(requestedSudokus);

    printControls.classList.remove("hidden");
}

function createPages(sudokus) {
    for (let i = 0; i < sudokus.length; i += 2) {
        const page = document.createElement("div");
        page.classList.add("print-page");

        page.appendChild(
            createPrintSudoku(sudokus[i])
        );

        if (sudokus[i + 1]) {
            page.appendChild(createPrintSudoku(sudokus[i + 1]));
        }

        preview.appendChild(page);
    }
}

function createPrintSudoku(sudoku) {
    const wrapper = document.createElement("div");

    wrapper.classList.add("print-sudoku");

    wrapper.appendChild(
        createPrintGrid(sudoku.grid)
    );

    return wrapper;
}

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