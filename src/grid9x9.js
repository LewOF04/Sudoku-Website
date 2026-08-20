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
        return this.grid[row];
    } 

    getColumn(col){
        let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        for(let i = 0; i < 9; i++){
            tempArr[i] = this.grid[i][col];
        }

        return tempArr;
    }

    get3x3Grid(idx){
        /*
        0 | 1 | 2
        3 | 4 | 5
        6 | 7 | 8
        */
        let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        let col = idx % 3;
        let row = Math.floor(idx / 3);

        for(let i = 0; i < 3; i++){
            let rowArr = this.grid[(row * 3) + i];

            for(let j = 0; j < 3; j++){
                tempArr[(i * 3) + j] = rowArr[(col * 3) + j];
            }
        }

        return tempArr;
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