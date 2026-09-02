export class grid9x9{
    constructor(){
        this.grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    /**
     * given a row index, return the values of the entire row
     * @param {*} row - row index (0-8)
     * @returns array of values in the row (in order from column 0 - 8)
     */
    getRow(row){
        let positions = [
            {row: row, col: 0}, 
            {row: row, col: 1}, 
            {row: row, col: 2}, 
            {row: row, col: 3}, 
            {row: row, col: 4}, 
            {row: row, col: 5},
            {row: row, col: 6}, 
            {row: row, col: 7}, 
            {row: row, col: 8}
        ];
        return {positions, values: this.grid[row]};
    } 

    /**
     * given a column index, return the values of the entire column
     * @param {*} col - column index (0-8)
     * @returns array of values in the column (in order from row 0 - 8)
     */
    getColumn(col){
        let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let positions = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

        for(let i = 0; i < 9; i++){
            tempArr[i] = this.grid[i][col];
            positions[i] = {row: i, col: col};
        }

        return {positions, values: tempArr};
    }

    /**
     * given a grid index, return the values of the entire grid
     * @param {*} idx - grid index (0-8)
     * @returns array of values in the 3x3 grid (in order from top left to bottom right)
     */
    get3x3Grid(idx){
        /*
        0 | 1 | 2
        3 | 4 | 5
        6 | 7 | 8
        */
        let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let positions = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

        let col = idx % 3; //the starting column of the section
        let row = Math.floor(idx / 3); //the starting row of the section

        for(let i = 0; i < 3; i++){
            let rowArr = this.grid[(row * 3) + i]; //get all values of the current row

            for(let j = 0; j < 3; j++){
                tempArr[(i * 3) + j] = rowArr[(col * 3) + j]; //set the value from the column in the current row
                positions[(i * 3) + j] = {row: row*3 +i, col: col*3 + j}; //update the grid position for the value
            }
        }

        return {positions, values: tempArr};
    }

    /**
     * Get the number stored at specific index
     * @param {} row row index
     * @param {*} col column index
     * @returns the number stored in index
     */
    getNum(row, col){
        return this.grid[row][col];
    }

    /**
     * Produce a copy of the grid unlinked from the original
     * @returns new grid9x9 object
     */
    copy(){
        let newGrid = [];

        for(let i = 0; i < 9; i++){
            let tempArr = [];
            for(let j = 0; j < 9; j++){
                tempArr[j] = this.grid[i][j];
            }
            newGrid[i] = tempArr;
        }

        let newObj = new grid9x9();
        newObj.grid = newGrid;

        return newObj;
    }

    /**
     * Create a string version of the grid
     * @returns string representation of the grid values
     */
    toString(){
        let string = "----".repeat(9) + "\n";

        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                string += "| " + this.grid[i][j] + " ";
            }
            string += "|\n" + "----".repeat(9) + "\n";
        }

        return string;
    }

    /**
     * Check whether two grids store the exact same values
     * @param {*} otherGrid - the grid being compared to this object
     * @returns true if the same, false if different
     */
    equal(otherGrid){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(this.grid[i][j] != otherGrid.grid[i][j]) return false;
            }
        }
        return true;
    }
}