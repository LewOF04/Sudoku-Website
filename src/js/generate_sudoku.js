/**
 * Algorithm for Sudoku generation based on that outlined in:
 * 
 * Bhattarai, A., Uprety, D., Pathak, P., Shrestha, S., Narkarmi, S. and Sigdel, S. (n.d.). 
 * A Study Of Sudoku Solving Algorithms: Backtracking and Heuristic. 
 * [online] Available at: https://arxiv.org/pdf/2507.09708 [Accessed 20 Aug. 2026].
 */

import {grid9x9} from "./grid9x9.js";

/**
 * Check whether a given number placement is valid given the row, column and grid
 * @param {*} grid 
 * @param {*} row 
 * @param {*} col 
 * @param {*} num 
 * @returns true if valid, false if invalid
 */
function isValidMove(grid, row, col, num){
    let rowArr = grid.getRow(row).values;
    let colArr = grid.getColumn(col).values;

    let rowIdx = Math.floor(row / 3);
    let colIdx = Math.floor(col / 3);

    let gridNum = colIdx + (3 * rowIdx);
    let grid3x3Arr = grid.get3x3Grid(gridNum).values;

    if(rowArr.includes(num) || colArr.includes(num) || grid3x3Arr.includes(num)) return false;

    return true;
}

/**
 * Find any area in the grid which is currently not filled by a value
 * @param {*} grid the grid which we check for empty spaces
 * @returns - the coordinates of the space in a 2 element array (or null if no spaces exist)
 */
function findEmpty(grid){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(grid.grid[i][j] == 0) return [i,j];
        }
    }
    return null;
}

/**
 * Given a grid, fill the grid with numbers until completed
 * @param {*} grid 
 * @returns - true if sudoku solved, false if not
 */
function solveSudoku(grid){
    let emptyLoc = findEmpty(grid);
    if(emptyLoc == null) return true;

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers = randomizeArray(numbers);
    let num = -1;

    for(let i = 0; i < numbers.length; i++){
        num = numbers[i];
        if(isValidMove(grid, emptyLoc[0], emptyLoc[1], num)){
            grid.updateGrid(emptyLoc[0], emptyLoc[1], num);
            if(solveSudoku(grid)) return true;
            grid.updateGrid(emptyLoc[0], emptyLoc[1], 0);
        }
    }
    return false;
}

/**
 * Given an array of numbers, return the array with the same numbers in random order
 * @param {*} array - original array
 * @returns - randomised array
 */
function randomizeArray(array){
    let arrayTrack = [];
    let newArray = [];

    for(let i = 0; i < array.length; i++) arrayTrack.push(i);

    let idx = -1;
    let itr = 0;
    while(arrayTrack.length != 0){
        idx = Math.floor(Math.random() * arrayTrack.length);

        newArray[itr] = array[arrayTrack[idx]];

        arrayTrack.splice(idx, 1);
        itr++;
    }
    
    return newArray;
}

/**
 * Generate a complete sudoku grid and a starting point grid with set numbers
 * @param {*} clueNum - the number of clues we want in the sudoku
 * @returns {startGrid, solution} - the starting grid and the completed solution grid
 */
export function generateSudoku(clueNum){
    console.log("Clue Number " + clueNum.toString());
    const grid = new grid9x9();

    let idx = [0, 3, 6];
    for(let i = 0; i< 3; i++){
        let numbers = randomizeArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for(let j = 0; j < 3; j++){
            for(let k = 0; k < 3; k++){
                grid.updateGrid(idx[i] + j, idx[i] + k, numbers.pop());
            }
        }
    }
    solveSudoku(grid);

    let solution = grid.copy();
    let startGrid = grid.copy();

    //decide which cells to remove
    let cells = [];
    for(let k = 0; k < 9; k++){
        for(let z = 0; z < 9; z++){
            let string = k.toString() + z.toString();
            cells[(k * 9) + z] = string;
        }
    }
    let shuffledCellOrder = randomizeArray(cells);
    
    for(let q = 0; q < (81 - clueNum); q ++){
        let cellID = shuffledCellOrder[q];

        let iIdx = parseInt(cellID.substring(0,1));
        let jIdx = parseInt(cellID.substring(1));

        startGrid.updateGrid(iIdx, jIdx, 0);
    }

    return {startGrid, solution};
}

export function calcClueNum(difficulty){
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
        
    return Math.floor(Math.random() * (max - min) + min);
}