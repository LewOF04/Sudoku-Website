export class userData{
    constructor(name, lvl, pts, totalPts, crtOn){
        this.username = name;
        this.level = lvl;
        this.points = pts;
        this.totalPoints = totalPts;
        this.createdOn = crtOn;
    }
}

export class gameData{
    constructor(sudokuInfo){ //an array of gameInfo
        this.sudokuGames = sudokuInfos;
    }
}

export class gameInfo{
    constructor(strtGrid, finGrid, diff, time, errs, scr, isFin){
        this.startGrid = strtGrid;
        this.finalGrid = finGrid;
        this.difficulty = diff;
        this.time = time; 
        this.errors = errs;
        this.score = scr;
        this.isFinished = isFin;
    }
}