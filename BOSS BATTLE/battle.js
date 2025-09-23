const canvas = document.getElementById("battleground");
const ctx = canvas.getContext("2d");
let width, height, mouseX, mouseY, mouseDir;
let counter = 0;
let lastTime = 0;
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
    maxSpeed: 500,
    acceleration: 3000,
    friction: 0.9,
}; // player data and constants
const cursor = {
    x: 0,
    y: 0,
    size: 25,
};
const gun = {
    x: 0,
    y: 0,
    offset: 0,
}
const bullet = {
    speed: 600,
    spread: 0.1,
}
const bulletData = [];
window.addEventListener("resize", resizeCanvas); // resize the canvas every time the window is resized
document.addEventListener("keydown", (e) => {pressedKeys[e.code] = true;});
document.addEventListener("keyup", (e) => {pressedKeys[e.code] = false;});
canvas.addEventListener("mousemove", (e) => {mouseX = e.clientX; mouseY = e.clientY});
canvas.addEventListener("click", () => {bulletData.push(gun.x, gun.y, bullet.speed, mouseDir + (Math.random() * bullet.spread) - bullet.spread/2, 7.5); player.xv += bullet.speed/-10 * Math.cos(mouseDir); player.yv += bullet.speed/-10 * Math.sin(mouseDir);});

function drawCursor() {
    cursor.x = mouseX;
    cursor.y = mouseY;
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, cursor.size/2, 0, Math.PI * 2);
    ctx.stroke();
}

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function drawObjects(dt) {
    for (let i = 0; i < bulletData.length; i += 5) {
        ctx.beginPath();
        ctx.shadowBlur = 15;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.arc(bulletData[i], bulletData[i + 1], bulletData[i + 4], 0, Math.PI * 2);
        ctx.fill();
        bulletData[i] += bulletData[i + 2] * Math.cos(bulletData[i + 3]) * dt;
        bulletData[i + 1] += bulletData[i + 2] * Math.sin(bulletData[i + 3]) * dt;
        if (bulletData[i] < (-1 * bulletData[i + 2]) || bulletData[i] > width + bulletData[i + 2] || bulletData[i + 1] < (-1 * bulletData[i + 2]) || bulletData[i + 1] > height + bulletData[i + 2]) {
            bulletData.splice(i, 5);
        }
    }
}

function drawGun() {
    ctx.fillStyle = "rgba(127, 200, 255, 1)";
    ctx.shadowColor = "rgba(127, 200, 255, 0.5)";
    ctx.beginPath();
    gun.x = player.x + (24 * Math.cos(mouseDir));
    gun.y = player.y + (24 * Math.sin(mouseDir))
    ctx.arc(gun.x, gun.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(player.x + (20 * Math.cos(mouseDir)), player.y + (20 * Math.sin(mouseDir)), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(player.x + (16 * Math.cos(mouseDir)), player.y + (16 * Math.sin(mouseDir)), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.arc(player.x + (12 * Math.cos(mouseDir)), player.y + (12 * Math.sin(mouseDir)), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    gun.offset = mouseX > player.x ? 4 : -4;
    ctx.arc(player.x + (12 * Math.cos(mouseDir)) + (gun.offset * Math.cos(mouseDir + Math.PI/2)), player.y + (12 * Math.sin(mouseDir)) + (gun.offset * Math.sin(mouseDir + Math.PI/2)), 6, 0, Math.PI * 2);
    ctx.fill();
}

function drawBackground() {
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);
}

function drawPlayer() {
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle ="rgba(255, 255, 255, 1)"; 
    ctx.beginPath();
    ctx.roundRect(player.x - (player.xSize/2), player.y - (player.ySize/2), player.xSize, player.ySize, player.xSize / 5); // temporary player render, will fix later
    ctx.fill();
}

function updateGame(dt) {
    let dx = 0, dy = 0;
    let onWall = 0;
    if (pressedKeys["ArrowRight"] || pressedKeys["KeyD"]) dx += 1;
    if (pressedKeys["ArrowLeft"] || pressedKeys["KeyA"]) dx -= 1;
    if (pressedKeys["ArrowDown"] || pressedKeys["KeyS"]) dy += 1;
    if (pressedKeys["ArrowUp"] || pressedKeys["KeyW"]) dy -= 1;

    if (dx !== 0 || dy !== 0) {
        let len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
    }
    
    player.xv += dx * player.acceleration * dt;
    player.yv += dy * player.acceleration * dt;

    player.xv *= player.friction;
    player.yv *= player.friction;

    player.speed = Math.hypot(player.xv, player.yv)
    if (player.speed > player.maxSpeed) {
        player.xv = (player.xv / player.speed) * player.maxSpeed;
        player.yv = (player.yv / player.speed) * player.maxSpeed;
    }

    if (player.x < 0 + (player.xSize / 2)) {player.x = 0 + (player.xSize / 2); player.xv = 0; onWall = 1;}
    if (player.x > width - (player.xSize / 2)) {player.x = width - (player.xSize / 2); player.xv = 0; onWall = 1;}
    if (player.y < 0 + (player.ySize / 2)) {player.y = 0 + (player.ySize / 2); player.yv = 0; onWall = 1;}
    if (player.y > height - (player.ySize / 2)) {player.y = height - (player.ySize / 2); player.yv = 0; onWall = 1;}

    player.x += (player.xv / (onWall + 1)) * dt;
    player.y += (player.yv / (onWall + 1)) * dt;
}

function gameLoop(timestamp = 0) {
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    counter++; // counter for sine or cosine animations
    mouseDir = Math.atan2(mouseY - player.y, mouseX - player.x);
    ctx.clearRect(0, 0, width, height); // clear the canvas
    drawBackground();
    drawPlayer();
    drawObjects(dt);
    drawGun();
    drawCursor(); // update to include other system things later
    /* const gun = new Image(); 
    ctx.save();
    if (mouseX > player.x) {
        gun.src = "testgun.png";
        ctx.translate(player.x + 10, player.y);
    } else {
        gun.src = "testgun2.png";
        ctx.translate(player.x - 10, player.y);
    }
    ctx.rotate(Math.atan2(mouseY - player.y, mouseX - player.x));
    ctx.drawImage(gun, 0, 0);
    ctx.restore(); */
    if (dt) updateGame(dt);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
