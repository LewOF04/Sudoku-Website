import {retrieveData} from "./data_storage.js";
import {calcLevelPts} from "./ranking_system.js";

const nameDisplay = document.getElementById("username");
const lvlText = document.getElementById("lvl-txt");
const progFill = document.getElementById("progress-fill");
const pointProg = document.getElementById("point-progress");
const pointLeft = document.getElementById("point-left");

const lifetimeScore = document.getElementById("lifetime-score");
const impScore = document.getElementById("impossible-score");
const expScore = document.getElementById("expert-score");
const hardScore = document.getElementById("hard-score");
const medScore = document.getElementById("medium-score");
const easyScore = document.getElementById("easy-score");
const begScore = document.getElementById("beginner-score");

const totalComplete = document.getElementById("total-complete");
const impComplete = document.getElementById("impossible-complete");
const expComplete = document.getElementById("expert-complete");
const hardComplete = document.getElementById("hard-complete");
const medComplete = document.getElementById("medium-complete");
const easyComplete = document.getElementById("easy-complete");
const begComplete = document.getElementById("beginner-complete");

const historyList = document.getElementById("history-list");

function displayHistory() {
    const data = retrieveData();
    
    if(!data){
        setNoData();
        return;
    }

    let userData = data.userData;
    let gameData = data.gameData;

    //set user data
    nameDisplay.textContent = userData.username;
    lvlText.textContent = userData.level;

    let totalPoints = userData.totalPoints;
    lifetimeScore.textContent = totalPoints;

    let lvlInfo = calcLevelPts(totalPoints);
    let level = lvlInfo.level;
    let remPoints = lvlInfo.remainingPoints;
    let pointsNeeded = lvlInfo.pointsNeeded;

    pointProg.textContent = remPoints;
    let lvlTotalPoints = remPoints + pointsNeeded;
    pointLeft.textContent = lvlTotalPoints;
    setProgressBar(remPoints, 'blue');

    //set history information
    let impNum = 0;
    let expNum = 0;
    let hardNum = 0;
    let medNum = 0;
    let easyNum = 0;
    let begNum = 0;
    let impCount = 0;
    let expCount = 0;
    let hardCount = 0;
    let medCount = 0;
    let easyCount = 0;
    let begCount = 0;

    //set history display
    historyList.innerHTML = "";

    if (!gameData || !gameData.sudokuGames || gameData.sudokuGames.length === 0) {
        historyList.textContent = "No games have been played yet.";
        return;
    }

    gameData.sudokuGames.forEach((game, index) => {
        switch(game.difficulty){
            case "beginner": begCount++; begNum += game.score; break;
            case "easy": easyCount++; easyNum += game.score; break; 
            case "medium": medCount++; medNum += game.score; break; 
            case "hard": hardCount++; hardNum += game.score; break; 
            case "expert": expCount++; expNum += game.score; break; 
            case "impossible": impCount++; impNum += game.score; break; 
            default: break;
        }
        
        const gameCard = createGameCard(game, index);

        historyList.appendChild(gameCard);
    });

    impScore.textContent = impNum;
    expScore.textContent = expNum;
    hardScore.textContent = hardNum;
    medScore.textContent = medNum;
    easyScore.textContent = easyNum;
    begScore.textContent = begNum;

    impComplete.textContent = impCount;
    expComplete.textContent = expCount;
    hardComplete.textContent = hardCount;
    medComplete.textContent = medCount;
    easyComplete.textContent = easyCount;
    begComplete.textContent = begCount;
}

function setNoData(){
    nameDisplay.textContent = "N/A";
    lvlText.textContent = "N/A";
    lifetimeScore = "N/A";

    pointProg.textContent = 0;
    pointLeft.textContent = 0;
    setProgressBar(0,'blue');

    impScore.textContent = "N/A";
    expScore.textContent = "N/A";
    hardScore.textContent = "N/A";
    medScore.textContent = "N/A";
    easyScore.textContent = "N/A";
    begScore.textContent = "N/A";

    impComplete.textContent = "N/A";
    expComplete.textContent = "N/A";
    hardComplete.textContent = "N/A";
    medComplete.textContent = "N/A";
    easyComplete.textContent = "N/A";
    begComplete.textContent = "N/A";
}

function setProgressBar(progress, colour){
    progress = Math.max(0, Math.min(100, progress));

    progFill.style.width = `${progress}%`;
    progFill.style.backgroundColor = colour;
}

function createGameCard(game, index) {

    const card = document.createElement("div");
    card.classList.add("game-card");


    const title = document.createElement("h2");
    title.textContent = `Game ${index + 1}`;

    card.appendChild(title);


    // Main horizontal layout
    const gameContent = document.createElement("div");
    gameContent.classList.add("game-card-content");


    // LEFT: game information
    const info = document.createElement("div");
    info.classList.add("game-info");

    info.innerHTML = `
        <p><strong>Difficulty:</strong> ${game.difficulty}</p>
        <p><strong>Time:</strong> ${formatTime(game.time)}</p>
        <p><strong>Errors:</strong> ${game.errors}</p>
        <p><strong>Score:</strong> ${Math.round(game.score)}</p>
        <p><strong>Status:</strong> ${game.isFinished ? "Completed" : "Unfinished"}</p>
    `;


    // RIGHT: grids
    const grids = document.createElement("div");
    grids.classList.add("history-grids");


    const startSection = document.createElement("div");

    const startTitle = document.createElement("h3");
    startTitle.textContent = "Starting Grid";

    startSection.appendChild(startTitle);
    startSection.appendChild(createGrid(game.startGrid));


    const finalSection = document.createElement("div");

    const finalTitle = document.createElement("h3");
    finalTitle.textContent = "Ending Grid";

    finalSection.appendChild(finalTitle);
    finalSection.appendChild(createGrid(game.finalGrid));


    grids.appendChild(startSection);
    grids.appendChild(finalSection);


    gameContent.appendChild(info);
    gameContent.appendChild(grids);

    card.appendChild(gameContent);

    return card;
}

function createGrid(gridData) {

    const grid = document.createElement("div");
    grid.classList.add("history-grid");

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell = document.createElement("div");
            cell.classList.add("history-cell");

            const value = gridData[row][col];

            if (value !== 0) {
                cell.textContent = value;
            }

            grid.appendChild(cell);
        }
    }

    return grid;
}

displayHistory();