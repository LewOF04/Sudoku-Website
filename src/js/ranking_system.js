import {getTime} from "./timer.js";
import {lerp, revLerp} from "./extraMaths.js"

export function getScore(difficulty, errors){
    let score = getStartingScore(difficulty);

    let time = getTime();
    let minutes = time.minutes + (time.hours * 60) + (time.seconds / 60);

    let errorTime = errors / 60; //add one second to the time for every error

    let multiplier = calcTimeMultiplier(difficulty, minutes + errorTime);

    return score * multiplier;
}

/**
 * Given the difficulty return the starting score for completing such a sudoku puzzle
 * @param {*} difficulty - the string representation of the difficulty level
 * @returns - an integer base score
 */
function getStartingScore(difficulty){
    switch(difficulty){
        case "beginner" : return 5;
        case "easy" : return 10;
        case "medium" : return 30;
        case "hard" : return 50;
        case "expert" : return 80;
        case "impossible" : return 100;
        default : return 10;
    }
}

/**
 * Calculate the multiplier given the below values
 * @param {*} lowerMin - lowest minute amount expected
 * @param {*} upperMin - highest minute amount expected
 * @param {*} mins - actual minute time taken
 * @param {*} lowerMult - lowest multiplier possible
 * @param {*} upperMult - highest multiplier possible
 * @returns - the multiplier to be applied to the score
 */
function interpolateMultiplier(lowerMin, upperMin, mins, lowerMult, upperMult){
    if(lowerMin > upperMin){
        let temp = lowerMin;
        lowerMin = upperMin;
        upperMin = temp;
    }
    if(lowerMult > upperMult){
        let temp = lowerMult;
        lowerMult = upperMult;
        upperMult = temp;
    }

    let decimal = 1 - revLerp(mins, lowerMin, upperMin);
    return lerp(decimal, lowerMult, upperMult);
}

/**
 * Calculates the multiplier to the base score based on the time taken and the difficulty of the sudoku
 * @param {*} difficulty - the string representation of the difficulty level
 * @param {*} time - the time in getTime() format
 * @returns - a multiplier value for the base time
 */
function calcTimeMultiplier(difficulty, time){
    //stores the time bounds expected for each level of difficulty compared to skill (in minutes)
    //[highest expected, beginner level lower bound, intermediate level lower bound, lowest expected]
    const timeBounds = new Map([
        ["beginner", [8, 4, 2, 0.5]],
        ["easy", [15, 8, 4, 1.5]],
        ["medium", [30, 17.5, 11, 4]],
        ["hard", [60, 35, 22.5, 8]],
        ["expert", [75, 45, 32.5, 12.5]],
        ["impossible", [110, 80, 50, 20]]
    ]);
    const multipliers = [0, 0.1, 0.75, 1.25, 2.5, 4]; //multiplier levels based on 

    let timeBound = timeBounds.get(difficulty);
    
    //values that determine what the final multiplier of the base time will be
    let lowerTimeBound = -1;
    let upperTimeBound = -1;
    let lowerMultiplier = -1;
    let upperMultiplier = -1;

    //assign different values based on where the minutes lie
    if(time > timeBound[0]){ //if the time is longer than the lowest bound
        lowerTimeBound = timeBound[0];
        upperTimeBound = timeBound[0]*2;
        lowerMultiplier = multipliers[0];
        upperMultiplier = multipliers[1];
    } 
    else if(time <= timeBound[0] && time > timeBound[1]){ //if the time is in the first bound
        lowerTimeBound = timeBound[1];
        upperTimeBound = timeBound[0];
        lowerMultiplier = multipliers[1];
        upperMultiplier = multipliers[2];
    }
    else if(time <= timeBound[1] && time > timeBound[2]){ //if the time is in the second bound
        lowerTimeBound = timeBound[2];
        upperTimeBound = timeBound[1];
        lowerMultiplier = multipliers[2];
        upperMultiplier = multipliers[3];
    }
    else if(time <= timeBound[2] && time > timeBound[3]){ //if the time is in the third bound
        lowerTimeBound = timeBound[3];
        upperTimeBound = timeBound[2];
        lowerMultiplier = multipliers[3];
        upperMultiplier = multipliers[4];
    }
    else if(time <= timeBound[3]){ //if the time is shorted than the highest bound
        lowerTimeBound = timeBound[3] / 2;
        upperTimeBound = timeBound[3];
        lowerMultiplier = multipliers[4];
        upperMultiplier = multipliers[5];
    }

    return interpolateMultiplier(lowerTimeBound, upperTimeBound, time, lowerMultiplier, upperMultiplier);
} 


export function calcLevelPts(totalPoints){
    let level = 0;
    let remainingPoints = totalPoints;

    let startingPoints = 100;
    let scale = 1.1;

    while (true) {

        const pointsNeeded = Math.ceil(startingPoints * Math.pow(scale, level));

        if (remainingPoints < pointsNeeded) {

            return {level, remainingPoints, pointsNeeded};
        }

        remainingPoints -= pointsNeeded;
        level++;
    }
}