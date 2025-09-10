let X = 100;
let Y = 100;
let XV = 0;
let YV = 0;
let offsetX, offsetY;
let gravity = 0.3;
let lastTimestamp = 0;
let mouseDown = false;
let mouseX, mouseY;
let angle = 0;
const radius = 8;
const bounce = 0.7;
const floorY = 600;

function animate(timestamp) {
    const deltatime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    requestAnimationFrame(animate);
    if (deltatime < 1000 / FPS) return;
    update();
}

function setup() {
    draw();
    testMouse();
    requestAnimationFrame(animate);
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(185, 218, 255, 1)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(100, 149, 237, 1)";
    ctx.fillRect(0, floorY, width, height-floorY);

    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.arc(X, Y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    drawLine(X, Y, X + radius * Math.cos(angle), Y + radius * Math.sin(angle), 255, 0, 0, 1, 2);

    ctx.restore();
    ctx.closePath();
    if (mouseDown) {
        drawLine(X, Y, mouseX, mouseY, 255, 0, 0, 1, 10);
    }
}
function drawLine(x1, y1, x2, y2, r = 0, g = 0, b = 0, a = 1, w = 2) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.lineWidth = w;
    ctx.stroke();
    ctx.closePath();
}

function physics() {
    YV += gravity;
    X += XV;
    Y += YV;
    if (Y > floorY - radius) {
        Y = floorY - radius;
        let nx = 0; let ny = -1;
        let dot = (XV * nx + YV * ny);
        XV = (XV - 2 * dot * nx) * bounce;
        YV = (YV - 2 * dot * ny) * bounce;
        if (Math.abs(YV) < 0.5) YV = 0;
        XV *= 0.99;
        if (Y >= floorY - radius - 0.1) {
            angle += XV / radius;
    }
    }
}

function testMouse() {
    myCanvas.addEventListener('mousedown', (e) => {
    mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
    mouseY = e.clientY - myCanvas.getBoundingClientRect().top;
    const dx = mouseX - X;
    const dy = mouseY - Y;
    if (Math.sqrt(dx * dx + dy * dy) < 10) {
        mouseDown = true;
    }
});

    myCanvas.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
        mouseY = e.clientY - myCanvas.getBoundingClientRect().top;
    }
});

myCanvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
    mouseY = e.clientY - myCanvas.getBoundingClientRect().top;
    const dx = mouseX - X;
    const dy = mouseY - Y;
    XV = dx * -0.2;
    YV = dy * 0.2;
});
};

function update() {
    draw();
    physics();
}

function gameloop() {
    const timestamp = Date.now();
    animate(timestamp);
}

const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
const width = myCanvas.width;
const height = myCanvas.height;
const FPS = 100;
setup();
gameloop();