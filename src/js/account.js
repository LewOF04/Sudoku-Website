import {pushData, retrieveData} from "./data_storage.js";
import {userData, gameData, gameInfo} from "./data_structs.js";
import {calcLevelPts} from "./ranking_system.js";

const nameDisplay = document.getElementById("username");
const lvlText = document.getElementById("lvl-txt");
const progFill = document.getElementById("progress-fill");
const lifetimeScore = document.getElementById("lifetime-score");
const accountCreation = document.getElementById("account-creation");
const usernameInput = document.getElementById("new-username");
const createButton = document.getElementById("create-button");
const createMsg = document.getElementById("create-message");
const pointProg = document.getElementById("point-progress");
const pointLeft = document.getElementById("point-left");

createButton.addEventListener("click", async function(){
    createMsg.classList.remove("error-message");
    createMsg.classList.remove("success-message");

    const username = usernameInput.value;
    if(username == ""){
        createMsg.classList.add("error-message");
        createMsg.textContent = "Username is required to be at least one character long.";
        return;
    }

    let newDate = new Date();
    let dateString = newDate.getDate()+"/"+newDate.getMonth()+"/"+newDate.getFullYear();

    let userAccount = new userData(username, 0, 0, 0, dateString);
    let userGames = new gameData(null);

    pushData(userAccount, userGames);
    createMsg.classList.add("success-message");
    createMsg.textContent = "Account created, download save file from 'Upload / Download Data' page.";
});

function getAccountInfo(){
    let data = retrieveData();
    if(!data){
        setNoData();
        return;
    } 

    const userData = data.userData;
    
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

    accountCreation.textContent = userData.createdOn;
}

function setProgressBar(progress, colour){
    progress = Math.max(0, Math.min(100, progress));

    progFill.style.width = `${progress}%`;
    progFill.style.backgroundColor = colour;
}

function setNoData(){
    nameDisplay.textContent = "N/A";
    lvlText.textContent = "N/A";
    lifetimeScore = "N/A";
    accountCreation.textContent = "N/A";

    pointProg.textContent = 0;
    pointLeft.textContent = 0;
    setProgressBar(0,'blue');
}

getAccountInfo();