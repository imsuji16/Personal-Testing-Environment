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

async function writeTextWithDelay(text, delay = 0, id) {
    const element = document.getElementById(id)
    element.textContent = "";
    for (const ch of text) {
        element.textContent += ch;
        await new Promise(res => setTimeout(res, delay));
    }
}

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
        clearInterval(bar);
        document.getElementById("btext").innerText = "Completed!";
    }
}, 20);