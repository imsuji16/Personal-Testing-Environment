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
document.querySelectorAll("#box, #htext, #ptext, #hold").forEach(element => {element.classList.add("visible")});

function fadeOut(...elements) {
    for (const element of elements) {
        const el = document.getElementById(element)
        el.classList.remove("visible");
        el.classList.add("invisible");
    }
}

function fadeIn(...elements) {
    for (const element of elements) {
        const el = document.getElementById(element)
        el.classList.remove("invisible");
        el.classList.add("visible");
    }
}

const bar = setInterval(() => {
    if (active && progress < 99 && !completed) {
        progress += 0.1;
    } else if (!active && progress > 1 && !completed) {
        progress -= 1;
    }
    document.getElementById("fill").style.width = progress + "%";
    document.getElementById("filleffect").style.width = `${progress * 1.05}%`;
    document.getElementById("btext").innerText = `Press & Hold (${Math.floor(progress)}%)`;
    textColor = `rgb(${255 - (progress * 2.40)}, ${255 - (progress * 2.25)}, ${255 - (progress * 2.10)})`;
    document.getElementById("btext").style.color = textColor;

    if (progress === 100) {
        completed = true;
        clearInterval(bar);
        document.getElementById("btext").innerText = "Completed!";
    }
}, 20);