import { describe, test, expect } from "vitest";
import { grid9x9 } from "../src/js/grid9x9.js";

describe("grid9x9", () => {

    test("new grid contains 9 rows", () => {
        const grid = new grid9x9();

        expect(grid.grid.length).toBe(9);
    });

    test("every row contains 9 cells", () => {
        const grid = new grid9x9();

        for (const row of grid.grid) {
            expect(row.length).toBe(9);
        }
    });

    test("getRow returns the correct row", () => {
        const grid = new grid9x9();

        grid.grid[2] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        expect(grid.getRow(2)).toEqual(
            [1, 2, 3, 4, 5, 6, 7, 8, 9]
        );
    });

    test("getColumn returns the correct column", () => {
        const grid = new grid9x9();

        for (let row = 0; row < 9; row++) {
            grid.grid[row][0] = row + 1;
        }

        expect(grid.getColumn(0)).toEqual(
            [1, 2, 3, 4, 5, 6, 7, 8, 9]
        );
    });

    test("get3x3Grid returns top-left 3x3 grid", () => {
        const grid = new grid9x9();

        grid.grid = [
            [1,2,3,0,0,0,0,0,0],
            [4,5,6,0,0,0,0,0,0],
            [7,8,9,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];

        expect(grid.get3x3Grid(0)).toEqual(
            [1,2,3,4,5,6,7,8,9]
        );
    });

    test("get3x3Grid returns centre 3x3 grid", () => {
        const grid = new grid9x9();

        grid.grid[3][3] = 1;
        grid.grid[3][4] = 2;
        grid.grid[3][5] = 3;

        grid.grid[4][3] = 4;
        grid.grid[4][4] = 5;
        grid.grid[4][5] = 6;

        grid.grid[5][3] = 7;
        grid.grid[5][4] = 8;
        grid.grid[5][5] = 9;

        expect(grid.get3x3Grid(4)).toEqual(
            [1,2,3,4,5,6,7,8,9]
        );
    });
});