const canvas = document.getElementById("battleground");
const ctx = canvas.getContext("2d");
let width, height;
resizeCanvas()
let X = (width/2) - 15, Y = (height/2) - 15, XV = 0, YV = 0; // temporary centering
const pressedKeys = {}; // current pressed key list, object literal

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function drawBackground() {
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, 0, width, height);
}

function updateGame() {
    if (pressedKeys["ArrowRight"] || pressedKeys["KeyD"]) {
        XV += 1;
    }
    if (pressedKeys["ArrowLeft"] || pressedKeys["KeyA"]) {
        XV -= 1;
    }
    if (pressedKeys["ArrowUp"] || pressedKeys["KeyW"]) {
        YV -= 1;
    }
    if (pressedKeys["ArrowDown"] || pressedKeys["KeyS"]) {
        YV += 1;
    }

    XV *= 0.85;
    YV *= 0.85;
    X += XV;
    Y += YV;
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;    
    ctx.fillRect(X, Y, 30, 30); // temporary player render, will fix later
    updateGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener("resize", resizeCanvas());

document.addEventListener("keydown", (e) => {
    pressedKeys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    pressedKeys[e.code] = false;
});
