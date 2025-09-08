let X = 100;
let Y = 100;
let XV = 0;
let YV = 0;
let gravity = 0.7

function draw() {
    ctx.clearRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
    ctx.fillStyle = "rgba(185, 218, 255, 1)";
    ctx.fillRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
    ctx.beginPath();
    ctx.arc(X, Y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fill();
    ctx.closePath();
}

function physics() {
    YV += gravity;
    X += XV;
    Y += YV;
    if (Y > 300) {
        Y = 300;
        YV *= -0.5;
    }
}

function update() {
    draw();
    physics();
}

const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
update();
setInterval(update, 20);