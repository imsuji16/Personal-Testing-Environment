const canvas = document.getElementById("battleground");
const ctx = canvas.getContext("2d");
let width, height, mouseY, mouseDir;
let mouseX = 1;
let counter = 0;
let lastTime = 0;
let lastPressedTime = 0;
let dashCooldown = 0;
const pressDelay = 300;
resizeCanvas();
const pressedKeys = {}; // current pressed key list
const player = {
    x: width / 2,
    y: height / 2,
    xSize: 30,
    ySize: 30,
    xv: 0,
    yv: 0,
    speed: 0,
    maxSpeed: 50000,
    acceleration: 3000,
    friction: 0.9,
    health: 3,
}; // player data and constants
const boss = {
    x: width/2,
    y: height/2,
    size: 30,
    health: 3,
    hit: 0,
}
const cursor = {
    x: 0,
    y: 0,
    size: 25,
    targetSize: 25,
    speed: 0.02,
};
const gun = {
    x: 0,
    y: 0,
    offset: 0,
}
const bulletConfig = {
    speed: 600,
    spread: 0.05,
}
const bulletData = [];
const explosionData = [];
const enemyData = [];

const dash = new CustomEvent("dash", {bubbles: true, cancelable: true});
window.addEventListener("resize", resizeCanvas); // resize the canvas every time the window is resized
document.addEventListener("keydown", (e) => {
    pressedKeys[e.code] = true;
    if (e.code === "Space") {
        e.preventDefault();
    }
});
document.addEventListener("keyup", (e) => {
    pressedKeys[e.code] = false;
    if (e.code === "Space") {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastPressedTime;
        if (timeDiff < pressDelay) {
            canvas.dispatchEvent(dash);
        }
        lastPressedTime = currentTime;
    }
});
canvas.addEventListener("mousemove", (e) => {mouseX = e.clientX; mouseY = e.clientY});
canvas.addEventListener("click", () => {
    bulletData.push({
        x: gun.x, 
        y: gun.y, 
        speed: bulletConfig.speed, 
        dir: mouseDir + (Math.random() * bulletConfig.spread) - bulletConfig.spread/2, 
        size: 7.5,
    });
    player.xv += bulletConfig.speed/-15 * Math.cos(mouseDir); player.yv += bulletConfig.speed/-15 * Math.sin(mouseDir);
    cursor.size = 32;
});
canvas.addEventListener("dash", () => {
    if (dashCooldown >= 60) {
        let xv = player.xv;
        let yv = player.yv;
        let len = Math.hypot(player.xv, player.yv);
        if (len > 0) {
            xv /= len;
            yv /= len;
        }  
        player.xv = xv * 1500;
        player.yv = yv * 1500;
        dashCooldown = 0;
        explosionData.push({
            x: player.x, 
            y: player.y, 
            tick: 20, 
            size: 0, 
            vel: 3, 
            type: 1,
        });
    }
});

function spawnEnemy(x, y, type, size, hit, health) {
    enemyData.push({
        x: x,
        y: y,
        type: type,
        size: size,
        hit: hit,
        health: health,
    });
}

function findNearestEnemy(x, y) {
    if (enemyData.length < 1) {
        return -1;
    }
    let j = 0;
    let nearest = Infinity;
    for (let i = 0; i < enemyData.length; i++) {
        let current = Math.hypot(enemyData[i].x - x, enemyData[i].y - y);
        if (current < nearest) {
            nearest = current;
            j = i;
        }
    }
    return j;
}

function drawRect(x, y, w, h, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.restore();
}

function drawCursor(dt) {
    ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
    cursor.x = mouseX;
    cursor.y = mouseY;
    cursor.size += (cursor.targetSize - cursor.size) * 2 * dt;
    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, cursor.size/2, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(mouseX + cursor.size/1.6 * Math.cos(counter * cursor.speed + (Math.PI*i/2)), mouseY + cursor.size/1.6 * Math.sin(counter * cursor.speed + (Math.PI*i/2)));
        ctx.lineTo(mouseX + cursor.size/1.8 * Math.cos(counter * cursor.speed + (Math.PI*i/2)), mouseY + cursor.size/1.8 * Math.sin(counter * cursor.speed + (Math.PI*i/2)));
        ctx.stroke();
    }
}

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function drawEnemies(dt) {
    for (let i = enemyData.length - 1; i >= 0; i--) {
        const e = enemyData[i];
        e.hit -= 15 * dt;
        if (e.hit < 0) e.hit = 0;
        ctx.shadowColor = `rgba(255, ${60 + Math.round(195 * e.hit)}, ${60 + Math.round(195 * e.hit)}, 0.5)`;
        ctx.shadowBlur = 25;
        ctx.fillStyle = `rgba(255, ${60 + Math.round(195 * e.hit)}, ${60 + Math.round(195 * e.hit)}, 1)`;
        ctx.beginPath();
        ctx.roundRect(e.x - (e.size/2), e.y - (e.size/2), e.size, e.size, e.size / 5);
        ctx.fill();
        speed = 100;
        let playerDir = Math.atan2(player.y - e.y, player.x - e.x);
        e.x += speed * Math.cos(playerDir) * dt;
        e.y += speed * Math.sin(playerDir) * dt;
        const enemyI = findNearestEnemy(e.x, e.y);
        let enemyDir = Math.atan2(e.y - enemyData[enemyI].y, e.x - enemyData[enemyI].x);

        if (e.health < 1) {
            explosionData.push({
                x: e.x,
                y: e.y,
                tick: 40,
                size: 10,
                vel: 7,
                type: 0,
            });
            enemyData.splice(i, 1);
            continue;
        }
    }
}

function drawObjects(dt) {
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    for (let i = bulletData.length - 1; i >= 0; i--) {
        const b = bulletData[i];
        ctx.beginPath();
        ctx.shadowBlur = 15;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
        b.x += b.speed * Math.cos(b.dir) * dt;
        b.y += b.speed * Math.sin(b.dir) * dt;
        let bulletSize = 7 + Math.hypot(b.x - player.x, b.y - player.y) / 250;
        b.size = bulletSize + (Math.cos(counter / 10) * 50) * dt;
        if (b.x < (-1 * b.size) || b.x > width + b.size || b.y < (-1 * b.size) || b.y > height + b.size) {
            bulletData.splice(i, 1);
            continue;
        }
        let index = (findNearestEnemy(b.x, b.y));
        if (index !== -1) {
            if (b.x < enemyData[index].x + enemyData[index].size/2 && b.y < enemyData[index].y + enemyData[index].size/2 && b.x > enemyData[index].x - enemyData[index].size/2 && b.y > enemyData[index].y - enemyData[index].size/2) {
                explosionData.push({
                    x: b.x,
                    y: b.y,
                    tick: 40,
                    size: 5,
                    vel: 3,
                    type: 0,
                });
                enemyData[index].hit += 2;
                enemyData[index].health -= 1;
                bulletData.splice(i, 1);
                continue;
            }
        }
    }
}

function drawParticles() {
    ctx.shadowBlur = 25;
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    for (let i = explosionData.length - 1; i >= 0; i--) {
        ctx.beginPath();
        const exp = explosionData[i];
        if (exp.size > 0) {
            ctx.arc(exp.x, exp.y, exp.size, 0, Math.PI * 2);
        }
        exp.tick--;
        if (exp.type === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, 1)`;
            ctx.fill();
            exp.vel--;
            exp.size += exp.vel;
        } else if (exp.type === 1) {
            ctx.strokeStyle =  `rgba(255, 255, 255, ${exp.tick/15})`
            ctx.lineWidth = 25 - exp.size;
            ctx.stroke();
            exp.size += exp.vel;
        }

        if (exp.tick < 1) {
            explosionData.splice(i, 1);
        }
    }
}

function drawHealth() {

}

function drawGun() {
    ctx.fillStyle = "rgba(127, 200, 255, 1)";
    ctx.shadowColor = "rgba(127, 200, 255, 0.5)";
    ctx.beginPath();
    gun.x = player.x + (22 * Math.cos(mouseDir));
    gun.y = player.y + (22 * Math.sin(mouseDir))
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
    dashCooldown++;4
    lastTime = timestamp;
    counter++; // counter for sine or cosine animations
    mouseDir = Math.atan2(mouseY - player.y, mouseX - player.x);
    ctx.clearRect(0, 0, width, height); // clear the canvas
    drawBackground();
    drawParticles();
    drawEnemies(dt);
    drawObjects(dt);
    drawPlayer();
    drawGun();
    drawHealth();
    drawCursor(dt); // update to include other system things later

    // some testing text
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = "30px Arial";
    ctx.fillText(player.xv, 10, 50);
    ctx.fillText(player.yv, 10, 100);4
    ctx.fillText(dashCooldown, 10, 150);
    if (dt) updateGame(dt);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
for (let i = 0; i < 11; i ++) {
    spawnEnemy(width - 100, Math.random() * height, 0, 30, 0, 3);
}