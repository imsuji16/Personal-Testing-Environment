const canvas = document.getElementById("battleground");
const ctx = canvas.getContext("2d");
let width, height;
resizeCanvas()
const pressedKeys = {}; // current pressed key list
const player = {
    x: width/2,
    y: height/2,
    xSize: 30,
    ySize: 30,
    xv: 0,
    yv: 0,
    speed: 0,
    maxSpeed: 1,
    acceleration: 0.6,
    friction: 0.95,
};
window.addEventListener("resize", resizeCanvas);
document.addEventListener("keydown", (e) => {pressedKeys[e.code] = true;});
document.addEventListener("keyup", (e) => {pressedKeys[e.code] = false;});

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function drawBackground() {
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, 0, width, height);
}

function updateGame() {
    let right = pressedKeys["ArrowRight"] || pressedKeys["KeyD"]
    let left = pressedKeys["ArrowLeft"] || pressedKeys["KeyA"]
    let up = pressedKeys["ArrowUp"] || pressedKeys["KeyW"]
    let down = pressedKeys["ArrowDown"] || pressedKeys["KeyS"]

    let dx = 0;
    let dy = 0;
    if (right) dx += 1;
    if (left) dx -= 1;
    if (down) dy += 1;
    if (up) dy -= 1;

    if (dx !== 0 || dy !== 0) {
        let len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
    }
    
    player.xv += dx * player.acceleration;
    player.yv += dy * player.acceleration;

    player.xv *= player.friction;
    player.yv *= player.friction;

    player.speed = Math.hypot(player.vx, player.vy)
    if (player.speed > player.maxSpeed) {
        player.xv = (player.xv / player.speed) * player.maxSpeed;
        player.yv = (player.yv / player.speed) * player.maxSpeed;
    }

    player.x += player.xv;
    player.y += player.yv;
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;    
    ctx.fillRect(player.x - (player.xSize/2), player.y - (player.ySize/2), player.xSize, player.ySize); // temporary player render, will fix later
    updateGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
