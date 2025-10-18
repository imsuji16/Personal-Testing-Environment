const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

let xVals, yVals, values;
let colsD, rowsD;
let r = 0, g = 0, b = 0;
const simplex = new SimplexNoise();

function easeOutCubic(val1, val2, min, max, mu) {
    let t = Math.max(0, Math.min(1, (mu - min) / (max - min)));
    t = 1 - Math.pow((1 - t), 3);
    return val1 + t * (val2 - val1);
}

function findTerrainForXY(v) {
    if (v < 0.45) { // water
        r = 29;
        g = 175;
        b = 251;
        return;
    } 
    if (v < 0.5) { // sand to grass gradient
        r = easeOutCubic(253, 117, 0.45, 0.6, v);
        g = easeOutCubic(247, 239, 0.45, 0.6, v);
        b = easeOutCubic(194, 125, 0.45, 0.6, v);
        return;
    }
    if (v < 0.75) { // grass to trees gradient
        r = easeOutCubic(117, 20, 0.6, 0.75, v);
        g = easeOutCubic(239, 180, 0.6, 0.75, v);
        b = easeOutCubic(125, 141, 0.6, 0.75, v);
        return;
    }
    if (v < 0.9) { // trees to rock gradient
        r = easeOutCubic(20, 58, 0.67, 0.9, v);
        g = easeOutCubic(180, 77, 0.67, 0.9, v);
        b = easeOutCubic(141, 91, 0.67, 0.9, v);
        return;
    }
    if (v < 1) { // snowcapped peak gradient
        r = easeOutCubic(189, 255, 0.94, 1, v);
        g = easeOutCubic(227, 255, 0.94, 1, v);
        b = easeOutCubic(255, 255, 0.94, 1, v);
    }

}

function generateNoise(w, h, cellSize, octaves) {
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
                amp /= 1.5;
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
    const offCtx = off.getContext("2d");
    off.width = columns;
    off.height = rows;

    const imageData = offCtx.createImageData(columns, rows);
    const data = imageData.data;

    const range = maxV - minV;
    for (let i = 0; i < arrayCap; i++) {
        const normalized = (values[i] - minV) / range;
        const val = normalized;
        const index = i * 4;
        findTerrainForXY(val);
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255;
    }

    offCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, width, height);
}
prevTime = 0, pastTime = 0;
ctx.fillStyle = "black";
ctx.font = "20px Arial";
prevTime = Date.now();
generateNoise(width, height, 1, 4);
pastTime = Date.now() - prevTime;

// DEBUG
ctx.fillText("Procedural Generation Test", 20, 30);
ctx.fillText("Render Time: " + pastTime / 1000 + "s", 20, 60);
ctx.fillText("Window Size: X: " + width + ", Y: " + height, 20, 90);
ctx.fillText("Grid Size: X: " + colsD + ", Y: " + rowsD, 20, 120);
ctx.fillText("Array Length: " + xVals.length, 20, 150);