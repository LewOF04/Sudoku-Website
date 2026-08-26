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

    getColumn(col){
        let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        let positions = [{}, {}, {}, {}, {}, {}, {}, {}, {}];

        for(let i = 0; i < 9; i++){
            tempArr[i] = this.grid[i][col];
            positions[i] = {row: i, col: col};
        }

        return {positions, values: tempArr};
    }

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

    getNum(row, col){
        return this.grid[row][col];
    }

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

    equal(otherGrid){
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if(this.grid[i][j] != otherGrid.grid[i][j]) return false;
            }
        }
        return true;
    }
}