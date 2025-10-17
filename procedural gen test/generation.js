const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

let xVals, yVals, values;
let colsD, rowsD;
const simplex = new SimplexNoise();

function generateNoise(w, h, xOffset, yOffset, cellSize, octaves) {
    const columns = (Math.ceil(w / cellSize));
    const rows = (Math.ceil(h / cellSize));
    colsD = columns;
    rowsD = rows;
    const arrayCap = columns * rows;

    if (!values || values.length < arrayCap) {
        xVals = new Float32Array(arrayCap);
        yVals = new Float32Array(arrayCap);
        values = new Float32Array(arrayCap);
    }

    let arrayIndex = 0;
    let minV = Infinity, maxV = -Infinity;

    for (let y = 0; y < h; y += cellSize) {
        for (let x = 0; x < w; x += cellSize) {

            let total = 0;
            let freq = 1;
            let amp = 1;
            let maxAmp = 0;

            for (let i = 0; i < octaves + 1; i++) {
                total += simplex.noise2D((x * freq) / 200, (y * freq) / 200) * amp;
                maxAmp += amp;
                amp /= 2;
                freq *= 2;
            }

            const value = total / maxAmp;
            xVals[arrayIndex] = x;
            yVals[arrayIndex] = y;
            values[arrayIndex] = value;
            
            if (value < minV) minV = value;
            if (value > maxV) maxV = value;
            arrayIndex++;
        }
    }
        const off = document.createElement("canvas");
        off.width = columns;
        off.height = rows;
        const offCtx = off.getContext("2d");

        const imageData = offCtx.createImageData(columns, rows);
        const data = imageData.data;

        const range = maxV - minV;
        for (let i = 0; i < arrayCap; i++) {
            const normalized = (values[i] - minV) / range;
            const val = normalized * 255;
            const index = i * 4;
            data[index] = val;
            data[index + 1] = val;
            data[index + 2] = val;
            data[index + 3] = 255;
    }

    ctx.putImageData(imageData, xOffset, yOffset);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, width, height);
}
let time = 0, prevTime = 0, pastTime = 0;
ctx.fillStyle = "black";
ctx.font = "20px Arial";
prevTime = Date.now();
generateNoise(width, height, 0, 0, 1, 2, time);
pastTime = Date.now() - prevTime;

// DEBUG
ctx.fillText("Procedural Generation Test", 20, 30);
ctx.fillText("Render Time: " + pastTime / 1000 + "s", 20, 60);
ctx.fillText("Window Size: X: " + width + ", Y: " + height, 20, 90);
ctx.fillText("Grid Size: X: " + colsD + ", Y: " + rowsD, 20, 120);
ctx.fillText("Array Length: " + xVals.length, 20, 150);

animate();