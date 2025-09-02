function updateMode(mode) {
    if (mode === 0)
        document.body.backgroundColor = "rgb(0, 0, 0)";
    else if (mode === 1)
        document.body.backgroundColor = "rgb(255, 255, 255)";
}

let mode = 1;
const button = document.getElementsByClassName("allbuttons")[0];
    
button.addEventListener("mousedown", () => {
    button.style.backgroundColor = "rgb(255, 255, 255)";
    button.style.color = "rgb(255, 102, 102)";
    button.style.border = "2px solid rgb(255, 102, 102)";
});
button.addEventListener("mouseup", () => {
    button.style.backgroundColor = "rgb(255, 144, 144)";
    button.style.color = "rgb(255, 255, 255)";
    button.style.border = "2px solid rgb(255, 144, 144)";
});
button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "rgb(255, 144, 144)";
    button.style.color = "rgb(255, 255, 255)";
    button.style.border = "2px solid rgb(255, 144, 144)";
    button.style.cursor = "pointer";
    button.style.transform = "translate(-50%, -50%) scale(1.03)";
});
button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "rgb(255, 102, 102)";
    button.style.border = "2px solid rgb(255, 102, 102)";
    button.style.color = "rgb(255, 255, 255)";
    button.style.transform = "translate(-50%, -50%) scale(1)";
});
button.addEventListener("click", () => {
    mode = (mode + 1) % 2;
    if (mode === 0) {
        button.innerText = "Switch to Light Mode";
    }
    else if (mode === 1) {
        button.innerText = "Switch to Dark Mode";
    }
    updateMode(mode);
});
