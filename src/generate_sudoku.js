/**
 * Algorithm for Sudoku generation based on that outlined in:
 * 
 * Bhattarai, A., Uprety, D., Pathak, P., Shrestha, S., Narkarmi, S. and Sigdel, S. (n.d.). 
 * A Study Of Sudoku Solving Algorithms: Backtracking and Heuristic. 
 * [online] Available at: https://arxiv.org/pdf/2507.09708 [Accessed 20 Aug. 2026].
 */

import {grid9x9, getRow, getColumn, get3x3Grid, getNum, copy, toString} from "./grid9x9.js";

function isValidMove(grid, row, col, num){
    let rowArr = grid.getRow(row);
    let colArr = grid.getColumn(col);

    let rowIdx = row % 3;
    let colIdx = col % 3;

    let gridNum = colIdx + (3 * rowIdx);
    let grid3x3Arr = grid.get3x3Grid(gridNum);

    if(num in rowArr || num in colArr || num in grid3x3Arr) return false;

    return true;
}

function findEmpty(grid){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(grid.grid[i][j] == 0) return [i,j];
        }
    }
    return null;
}

function solveSudoku(grid){
    let emptyLoc = findEmpty(grid);
    if(emptyLoc == null) return true;

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    numbers = randomizeArray(numbers);
    let num = -1;

    for(let i = 0; i < numbers.length; i++){
        num = numbers[i];
        if(isValidMove(grid, emptyLoc[0], emptyLoc[1], num)){
            grid.grid[emptyLoc[0]][emptyLoc[1]] = num;
            if(solveSudoku(grid)) return true;
            grid.grid[emptyLoc[0]][emptyLoc[1]] = num;
        }
    }
    return false;
}

function randomizeArray(array){
    let arrayTrack = [];
    let newArray = [];

    for(let i = 0; i < array.length; i++) arrayTrack.push(i);

    let idx = -1;
    let itr = 0;
    while(arrayTrack.length != 0){
        idx = Math.floor(Math.random() * arrayTrack.length);
        arrayTrack.splice(idx, 1);

        newArray[itr] = array[arrayTrack[idx]];
        itr++;
    }
    
    return newArray;
}

export function generateSudoku(clueNum){
    const grid = new grid9x9();

    let idx = [0, 3, 6];
    for(let i = 0; i< 3; i++){
        let numbers = randomizeArray([1,2,3,4,5,6,7,8]);

        for(let j = 0; j < 3; j++){
            for(let k = 0; k < 3; k++){
                grid.grid[idx[i] + j][idx[i] + k] = numbers.pop();
            }
        }
    }
    solveSudoku(grid);

    let solution = grid.copy();
    let startGrid = grid.copy();

    //decide which cells to remove
    let cells = [];
    for(let k = 0; k < 9; k++){
        for(let z = 0; z < 8; z++){
            let string = k.toString() + z.toString();
            cells[(k * 9) + z] = string;
        }
    }
    let shuffledCellOrder = randomizeArray(cells);
    
    for(let q = 0; q < (81 - clueNum); q ++){
        let cellID = shuffledCellOrder[q];

        let iIdx = parseInt(cellID.substring(0,1));
        let jIdx = parseInt(cellID.substring(1));

        startGrid.grid[iIdx][jIdx] = 0;
    }

    return {startGrid, solution};
}