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

    const file = fileInput.files[0];
    const password = loadPassword.value;

    if (!file) {
        loadMessage.textContent = "Please select a file.";
        return;
    }

    if (!password) {
        loadMessage.textContent = "Please enter your password.";
        return;
    }

    const success = await storeFromFile(file, password);

    if (success) {
        loadMessage.textContent = "Data loaded successfully.";
    }
    else {
        loadMessage.textContent = "Incorrect password or invalid file.";
    }
});

//file download
saveButton.addEventListener("click", async function() {

    const password = savePassword.value;

    if (!password) {
        saveMessage.textContent = "Please enter a password.";
        return;
    }

    await saveToFile(password);

    saveMessage.textContent = "Save file downloaded.";
});