export class userData{
    constructor(name, lvl, pts, totalPts){
        this.username = name;
        this.level = lvl;
        this.points = pts;
        this.totalPoints = totalPts;
    }
}

export class gameData{
    constructor(gameInfos){
        this.games = gameInfos;
    }
}

export class gameInfo{
    constructor(strtGrid, finGrid, diff, time, errs, scr){
        this.startGrid = strtGrid;
        this.finalGrid = finGrid;
        this.difficulty = diff;
        this.time = time; 
        this.errors = errs;
        this.score = scr;
    }
}