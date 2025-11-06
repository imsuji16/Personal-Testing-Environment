const gridContainer = document.getElementById("grid-container");
const grid = document.getElementById("grid");
const rows = 12;
const cols = 12; 
const root = document.documentElement;

root.style.setProperty("--cols", cols);
root.style.setProperty("--rows", rows);

let cells = [];
let run = false;

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        run = !run;
        document.getElementById("run").textContent = `Running: ${run}`;
    }
});

gridContainer.addEventListener("click", (e) => {
    const target = e.target;
    target.classList.toggle("alive");
    target.classList.toggle("dead");
});

function createGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.dataset.row = r;
            cell.dataset.col = c;
            (r + c) % 2 === 0 ? cell.classList.add("alive") : cell.classList.add("dead");
            cell.classList.add("cell");
            grid.appendChild(cell);
        }
    }
}

createGrid();