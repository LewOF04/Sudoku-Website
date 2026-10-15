const messageLoc = document.getElementById("dynamic-jump");

function setMessage(message){
    const fullMessage = "Today's Message: " + message;
    messageLoc.textContent = "";

    [...fullMessage].forEach((char, index) => {

        const span = document.createElement("span");

        span.textContent = char === " " ? "\u00A0" : char;

        span.style.setProperty("--char-index", index);

        messageLoc.appendChild(span);
    });
}

setMessage("Oh my god, there's a new message...");