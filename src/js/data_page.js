import {storeFromFile, saveToFile} from "./data_storage.js";

const fileInput = document.getElementById("file-input");
const loadPassword = document.getElementById("load-password");
const savePassword = document.getElementById("save-password");
const loadButton = document.getElementById("load-button");
const saveButton = document.getElementById("save-button");
const loadMessage = document.getElementById("load-message");
const saveMessage = document.getElementById("save-message");

//loading up file
loadButton.addEventListener("click", async function() {
    loadMessage.classList.remove("error-message");
    loadMessage.classList.remove("success-message");
    const file = fileInput.files[0];
    const password = loadPassword.value;

    if (!file) {
        loadMessage.textContent = "Please select a file.";
        loadMessage.classList.add("error-message");
        return;
    }

    if (!password) {
        loadMessage.textContent = "Please enter your password.";
        loadMessage.classList.add("error-message");
        return;
    }

    const success = await storeFromFile(file, password);

    if (success) {
        loadMessage.classList.add("success-message");
        loadMessage.textContent = "Data loaded successfully.";
    }
    else {
        loadMessage.textContent = "Incorrect password or invalid file.";
        loadMessage.classList.add("error-message");
    }
});

//file download
saveButton.addEventListener("click", async function() {
    saveMessage.classList.remove("error-message");
    saveMessage.classList.remove("success-message");

    const password = savePassword.value;

    if (!password) {
        saveMessage.classList.add("error-message");
        saveMessage.textContent = "Please enter a password.";
        return;
    }

    if(!await saveToFile(password)){
        saveMessage.classList.add("error-message");
        saveMessage.textContent = "No data to save, please upload a save file or create an account.";
        return;
    }

    saveMessage.classList.add("success-message");
    saveMessage.textContent = "Save file downloaded.";
});