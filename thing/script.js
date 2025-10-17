const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    dotProduct(other) {
        return (this.x * other.x) + (this.y * other.y);
    }
}

function setupGradients(width, height, cellSize) {
    const gradients = [];
    for (let i = 0; i < width/cellSize; i++) {
        gradients[i] = []; 
        for (let i = 0; i < width/cellSize; i++) {
            angle = Math.random() * 2 * Math.PI;
            gradients[i][j] = new Vector(Math.cos(angle), Math.sin(angle));
        }
    }
}

function noise(x, y, cellSize = 1) {
    let random = Math.random() * 360
    const vec1 = new Vector(Math.cos(random), Math.sin(random));
    random = Math.random() * 360
    const vec2 = new Vector(Math.cos(random), Math.sin(random));
    random = Math.random() * 360
    const vec3 = new Vector(Math.cos(random), Math.sin(random));
    random = Math.random() * 360
    const vec4 = new Vector(Math.cos(random), Math.sin(random));
    const hDisplace = new Vector(floor(x), 0);
    const vDisplace = new Vector(0, floor(y));
    const hDot = hDisplace.dotProduct(vec1);
    const vDot = vDisplace.dotProduct(vec1);
}