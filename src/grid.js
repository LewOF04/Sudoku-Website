class grid9x9{
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

        let row = 0;
        if(idx > 5) row = 2;
        else if(idx > 3) row = 1;

        for(let i = 0; i < 3; i++){
            let rowArr = this.grid[(row * 3) + i];

            for(let j = 0; j < 3; j++){
                tempArr[(i * 3) + j] = rowArr[(col * 3) + j];
            }
        }

        return tempArr;
    }
}