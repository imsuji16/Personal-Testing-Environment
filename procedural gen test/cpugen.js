const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

let values;
let minVal, maxVal, gW, gH, seedVal;

const terrain = [
    [0, 0.3, [50, 119, 255], [29, 175, 251]],   // deep water
    [0.3, 0.48, [29, 175, 251], [50, 208, 255]], // shallow water
    [0.48, 0.6, [253, 247, 194], [117, 239, 125]], // sand to grass
    [0.6, 0.75, [117, 239, 125], [20, 180, 141]],  // grass to forest
    [0.7, 0.92, [20, 180, 141], [58, 77, 91]],     // forest to rock
    [0.85, 1, [83, 130, 162], [255, 255, 255]]     // dark snow (rock snow) to snow
];

function cubic(t) {
    return t * t * (3 - 2 * t);
}

// lookup table (for terrain)
const lSize = 1000;
const lookup = new Uint8ClampedArray(lSize * 3);

for (let i = 0; i < lSize; i++) {
    const v = i / (lSize - 1);
    for (let j = 0; j < terrain.length; j++) {
        const [min, max, c1, c2] = terrain[j];
        if (v < max) {
            const t = (v - min) / (max - min);
            const e = Math.min(1, Math.max(cubic(t), 0));
            const idx = i * 3;
            lookup[idx] = c1[0] + (c2[0] - c1[0]) * e;
            lookup[idx + 1] = c1[1] + (c2[1] - c1[1]) * e;
            lookup[idx + 2] = c1[2] + (c2[2] - c1[2]) * e;
            break;
        }
    }
}

// copied this function off the internet lol
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// also copied this function XD
function hashSeed(base, offset) {
  let h = base ^ (offset * 0x9E3779B9);
  h ^= h >>> 16;
  h = Math.imul(h, 0x85EBCA6B);
  h ^= h >>> 13;
  h = Math.imul(h, 0xC2B2AE35);
  h ^= h >>> 16;
  return h >>> 0;
}

function generateNoise(w = 512, h = 512, offX = 0, offY = 0, octaves = 1, realistic = false, numIsl = 1, s) {
    const arrayCap = w * h;
    const islands = [];

    //deterministic seed
    let simplex, seed;
    if (s != null) {
        seed = s;
    } else {
        seed = Math.floor((Math.random() * 2 - 1) * 1000000000);
    }
    const rng = mulberry32(seed);
        simplex = new SimplexNoise(rng());

    if (!values || values.length < arrayCap) {
        values = new Float32Array(arrayCap);
    }

    // render islands at random angle, distance, radius, and terrain weight
    const randAngle = mulberry32(hashSeed(seed, 1));
    const randDist = mulberry32(hashSeed(seed, 2));
    const randRadius = mulberry32(hashSeed(seed, 3));
    const randWeight = mulberry32(hashSeed(seed, 4));

    for (let i = 0; i < numIsl; i++) {
        const angle = randAngle() * Math.PI * 2;
        const dist = Math.pow(randDist(), 0.4) * 0.8;
        const radius = 0.25 + randRadius() * 0.5;
        const weight = 0.6 + randWeight() * 0.5;

        islands.push({
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            r: radius * radius,
            w: weight,
        });
    }

    let arrayIndex = 0;
    let minV = Infinity, maxV = -Infinity;

    for (let y = 0; y < h; y++) {
        const ny = (y / h) * 2 - 1;

        for (let x = 0; x < w; x++) {
            const nx = (x / w) * 2 - 1;
            let total = 0;
            let freq = 1;
            let amp = 1;
            let maxAmp = 0;

            for (let i = 0; i < octaves; i++) {
                total += simplex.noise2D(x * freq / 200, y * freq / 200) * amp;
                maxAmp += amp;
                amp /= 1.5;
                freq *= 2;
            }

            let value = (total / maxAmp + 1) / 2;

            if (value < 0.3 && realistic) {
                value += simplex.noise2D(x / 10, y / 10) * 0.1;
            }

            // if realistic, render realistic islands; otherwise, generate pure noise (minecraft style procedural terrain)
            if (realistic) {
                let fSum = 0;
                for (const isl of islands) {
                    const dx = nx - isl.x;
                    const dy = ny - isl.y;
                    const d2 = dx * dx + dy * dy;
                    const normDist2 = d2 / (isl.r * isl.r);
                    const f = Math.max(0, 1 - normDist2);
                    fSum += isl.w * f * f * f * f * f;
                }

                const mask = Math.tanh(fSum) + simplex.noise2D(x / 200, y / 200) * 0.12 + (rng() * 0.01);
                value *= mask;
                if (value > 0.45) value += simplex.noise2D(x / 20, y / 20) * 0.03;
            }

            values[arrayIndex++] = value;
            
            if (value < minV) minV = value;
            if (value > maxV) maxV = value;
        }
    }

    // make an offscreen canvas for better and faster rendering
    const offscreen = new OffscreenCanvas(w, h);
    const offCtx = offscreen.getContext("2d");

    const imageData = offCtx.createImageData(w, h);
    const data = imageData.data;

    const range = maxV - minV;

    // find terrain values and edit pixels on an image to their color data depending on the height
    for (let i = 0; i < arrayCap; i++) {
        const normalized = (values[i] - minV) / range;
        const idx = ((normalized * (lSize - 1)) | 0) * 3;
        const base = i * 4;
        data[base] = lookup[idx]; 
        data[base + 1] = lookup[idx + 1]; 
        data[base + 2] = lookup[idx + 2]; 
        data[base + 3] = 255;
    }

    offCtx.putImageData(imageData, 0, 0);
    ctx.width = width;
    ctx.height = height;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(offscreen, offX - w/2, offY - h/2, w, h);


    // for debug purposes
    maxVal = maxV, minVal = minV;
    gW = w, gH = h;
    seedVal = seed;
}

prevTime = 0, pastTime = 0;
ctx.fillStyle = "black";
ctx.font = "20px Arial";
prevTime = Date.now();
generateNoise(width, height, width/2, height/2, 8, true, 50, 894588);
pastTime = Date.now() - prevTime;

// DEBUG
ctx.fillText("Procedural Generation Test", 20, 30);
ctx.fillText("Render Time: " + pastTime / 1000 + "s", 20, 60);
ctx.fillText("Window Size: X: " + width + ", Y: " + height, 20, 90);
ctx.fillText("Render Area Size: X: " + gW + ", Y: " + gH, 20, 120);
ctx.fillText("Array Length: " + values.length, 20, 150);
ctx.fillText("Seed: " + seedVal, 20, 180);
ctx.fillText("Min Height: " + Math.round(minVal * 1000) / 1000 + ", Max Height: " + Math.round(maxVal * 1000) / 1000, 20, 210);