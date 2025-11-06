const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bodies = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
width = canvas.width;
height = canvas.height;
let mouseX = 0, mouseY = 0;
let bodiesNum = 0;
let paused = true;

canvas.addEventListener("mousemove", (e) => {mouseX = e.clientX; mouseY = e.clientY});
canvas.addEventListener("click", () => {
    addBody(mouseX, mouseY, Math.random() * 100, Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
    bodiesNum += 1;
});

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        paused = !paused;
    }
});

requestAnimationFrame(loop);

function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, 0, width, height);
    renderBodies();
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.font = "30px Monospace";
    ctx.fillText("Bodies: " + bodiesNum, 40, height - 40);
    ctx.fillText("Paused?: " + paused, 40, height - 80);

    requestAnimationFrame(loop);
}

function renderBodies() {
    for (let i = 0; i < bodies.length; i++) {
        const n = bodies[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${n.r}, ${n.g}, ${n.b}, 1)`;
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function addBody(x, y, radius, r, g, b, mass, xV, yV, xA, yA) {
    bodies.push({ x, y, radius, r, g, b, mass, xV, yV, xA, yA });
}