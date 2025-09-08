function drawPoint(x,y) {
    
    ctx.strokeStyle = "rgba(214, 224, 243, 1)";
    ctx.lineWidth = 20;
    ctx.strokeRect(0, 0, myCanvas.clientWidth, myCanvas.clientHeight);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 128, 128, 1)";
    ctx.fill();
    ctx.closePath();
}

let pointX = 100;
let pointY = 100;
let isDragging = false;
let offsetX, offsetY;
let pointYVelocity = 0;
let pointXVelocity = 0;
let gravity = 1;

const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");
drawPoint(pointX, pointY);

myCanvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
    const mouseY = e.clientY - myCanvas.getBoundingClientRect().top;
    const dx = mouseX - pointX;
    const dy = mouseY - pointY;
    if (Math.sqrt(dx * dx + dy * dy) < 5) {
        isDragging = true;
        offsetX = dx;
        offsetY = dy;
    }
});

myCanvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const mouseX = e.clientX - myCanvas.getBoundingClientRect().left;
        const mouseY = e.clientY - myCanvas.getBoundingClientRect().top;
        pointX = mouseX - offsetX;
        pointY = mouseY - offsetY;
        drawPoint(pointX, pointY);
    }
});

myCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});

pointX += pointXVelocity;
pointY += pointYVelocity;