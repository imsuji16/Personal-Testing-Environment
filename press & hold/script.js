const button = document.getElementById("hold")
let active = false;
let progress = 0;
let completed = false;
let textColor = "rgb(255, 255, 255)";
button.addEventListener("mousedown", () => {
    active = true;
});

button.addEventListener("mouseup", () => {
    active = false;
});

setInterval(() => {
    if (active && progress < 100 && !completed) {
        progress += 1;
    } else if (!active && progress > 0 && !completed) {
        progress -= 1;
    }
    document.getElementById("fill").style.width = progress + "%";
    document.getElementById("filleffect").style.width = `${progress * 1.05}%`;
    document.getElementById("btext").innerText = `Press & Hold (${progress}%)`;
    textColor = `rgb(${255 - (progress * 2.40)}, ${255 - (progress * 2.25)}, ${255 - (progress * 2.10)})`;
    document.getElementById("btext").style.color = textColor;

    if (progress === 100) {
        completed = true;
        clearInterval(this);
        document.getElementById("btext").innerText = "Completed!";
    }
}, 20);