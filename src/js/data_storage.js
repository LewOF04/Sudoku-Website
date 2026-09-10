import {encrypt, decrypt} from "./encryption.js";
import {calcLevelPts} from "./ranking_system.js";

/**
 * Store data from a uploaded file to the session storage
 * @param {*} file - the file we're storing
 * @param {*} password - the password to decrypt the file
 */
export async function storeFromFile(file, password){
    try{
        const fileContents = await file.text();

        const encryptedFile = JSON.parse(fileContents);

        const decryptedText = await decrypt(
            encryptedFile,
            password
        );

        const loadedData = JSON.parse(decryptedText);

        const userData = loadedData.userData;
        const gameData = loadedData.gameData;

        sessionStorage.setItem("userData", JSON.stringify(userData));
        sessionStorage.setItem("gameData", JSON.stringify(gameData));

        return true;

    } catch (error) {

        console.error(
            "Incorrect password or invalid save file"
        );

        return false;
    }
}

/**
 * Take data from the session storage and save it to a file
 * @param {*} password - the password for encryption
 */
export async function saveToFile(password) {

    const saveData = retrieveData();
    if(!saveData){
        return false;
    }

    const jsonData = JSON.stringify(saveData);

    const encryptedData = await encrypt(
        jsonData,
        password
    );

    const fileContents = JSON.stringify(
        encryptedData,
        null,
        2
    );

    const blob = new Blob(
        [fileContents],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "sudoku-save.json";

    link.click();

    URL.revokeObjectURL(url);

    return true;
}

/**
 * Retrieve the session data locally
 * @returns {userData, gameData} - the two data storage objects
 */
export function retrieveData(){
    const uData = sessionStorage.getItem("userData");
    const gData = sessionStorage.getItem("gameData");

    let userData = null;
    let gameData = null;

    if(uData){
        userData = JSON.parse(uData);
    }else{
        return null;
    }
    if(gData){
        gameData = JSON.parse(gData);
    }else{
        return null;
    }

    return {userData, gameData};
}

/**
 * Push local data to the session storage
 * @param {*} userData - the userData object to be stored
 * @param {*} gameData - the gameData object to be stored
 */
export function pushData(userData, gameData){
    sessionStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("gameData", JSON.stringify(gameData));
}

export function addGame(data){
    const savedData = retrieveData();

    const gameData = savedData.gameData;
    const userData = savedData.userData;

    gameData.sudokuGames.push(data);

    userData = updateUser(data, userData);

    pushData(userData, gameData);
}

function updateUser(data, userData){
    let totalPoints = userData.totalPoints;
    totalPoints += data.score;

    let levelInfo = calcLevelPts(totalPoints);
    userData.level = levelInfo.level;
    userData.points = remainingPoints;
    userData.totalPoints = totalPoints;

    return userData;
}