import { describe, test, expect } from "vitest";
import { generateSudoku } from "../src/generate_sudoku.js";
import { grid9x9 } from "../src/grid9x9.js";

function containsOneToNine(array) {
    const sorted = [...array].sort();

    return JSON.stringify(sorted) ===
        JSON.stringify([1,2,3,4,5,6,7,8,9]);
}

describe("generateSudoku", () => {

    test("returns a start grid and a solution", () => {
        const sudoku = generateSudoku(30);

        expect(sudoku).toHaveProperty("startGrid");
        expect(sudoku).toHaveProperty("solution");
    });

    test("copy is independent from original", () => {
        const grid = new grid9x9();

        grid.grid[0][0] = 5;

        const copiedGrid = grid.copy();

        copiedGrid.grid[0][0] = 7;

        expect(grid.grid[0][0]).toBe(5);
    });

    test("every solution row contains 1-9", () => {
        const { startGrid, solution } = generateSudoku(30);

        for (let row = 0; row < 9; row++) {
            expect(
                containsOneToNine(solution.getRow(row))
            ).toBe(true);
        }
    });

    test("every solution column contains 1-9", () => {
        const { startGrid, solution } = generateSudoku(30);

        for (let col = 0; col < 9; col++) {
            expect(
                containsOneToNine(solution.getColumn(col))
            ).toBe(true);
        }
    });

    test("every solution 3x3 block contains 1-9", () => {
        const { startGrid, solution } = generateSudoku(30);

        for (let block = 0; block < 9; block++) {
            expect(
                containsOneToNine(solution.get3x3Grid(block))
            ).toBe(true);
        }
    });

    test("generates requested number of clues", () => {
        const { startGrid, solution } = generateSudoku(30);

        let clues = 0;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {

                if (startGrid.grid[row][col] !== 0) {
                    clues++;
                }

            }
        }

        expect(clues).toBe(30);
    });

    test("generates valid solutions repeatedly", () => {
        for (let attempt = 0; attempt < 100; attempt++) {

            const { startGrid, solution } = generateSudoku(30);

            for (let row = 0; row < 9; row++) {
                expect(
                    containsOneToNine(solution.getRow(row))
                ).toBe(true);
            }

            for (let col = 0; col < 9; col++) {
                expect(
                    containsOneToNine(solution.getColumn(col))
                ).toBe(true);
            }

            for (let block = 0; block < 9; block++) {
                expect(
                    containsOneToNine(solution.get3x3Grid(block))
                ).toBe(true);
            }
        }

    });

    test("every puzzle clue matches the solution", () => {
        const { startGrid, solution } = generateSudoku(30);

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {

                const clue = startGrid.grid[row][col];

                if (clue !== 0) {
                    expect(clue).toBe(
                        solution.grid[row][col]
                    );
                }
            }
        }
    });
});