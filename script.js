const cnv = document.getElementById("cnv");
const ctx = cnv.getContext("2d");
const algoSel = document.getElementById("algo");
const szInput = document.getElementById("sz");
const spdInput = document.getElementById("spd");
const goBtn = document.getElementById("go");
const resetBtn = document.getElementById("reset");

let arr = [];
let size = parseInt(szInput.value);
let running = false;

function resize() {
    cnv.width = cnv.clientWidth;
    cnv.height = cnv.clientHeight;
}

function genArr() {
    arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.random());
    }
}

function getDelay() {
    const stepsPerSec = parseInt(spdInput.value);
    return 1000 / stepsPerSec;
}

function draw(highlight = []) {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    const w = cnv.width / size;

    for (let i = 0; i < size; i++) {
        ctx.fillStyle = highlight.includes(i) ? "#ff4d4f" : "#2d6cdf";
        ctx.fillRect(
            i * w,
            cnv.height - arr[i] * cnv.height,
            w - 1,
            arr[i] * cnv.height
        );
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {

            if (!running) return;

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }

            draw([j, j + 1]);
            await sleep(getDelay());
        }
    }
}

async function selectSort() {
    for (let i = 0; i < arr.length; i++) {

        if (!running) return;

        let min = i;

        for (let j = i + 1; j < arr.length; j++) {

            if (!running) return;

            if (arr[j] < arr[min]) min = j;

            draw([i, j, min]);
            await sleep(getDelay());
        }

        [arr[i], arr[min]] = [arr[min], arr[i]];
        draw([i, min]);
        await sleep(getDelay());
    }
}

async function insertSort() {
    for (let i = 1; i < arr.length; i++) {

        if (!running) return;

        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {

            if (!running) return;

            arr[j + 1] = arr[j];
            j--;

            draw([j + 1, j + 2]);
            await sleep(getDelay());
        }

        arr[j + 1] = key;
        draw([j + 1]);
        await sleep(getDelay());
    }
}

async function start() {
    if (running) return;

    running = true;
    goBtn.disabled = true;

    size = parseInt(szInput.value);
    genArr();
    draw();

    const algo = algoSel.value;

    if (algo === "bubble") await bubbleSort();
    else if (algo === "select") await selectSort();
    else if (algo === "insert") await insertSort();

    running = false;
    goBtn.disabled = false;
}

function reset() {
    running = false;
    goBtn.disabled = false;

    size = parseInt(szInput.value);
    genArr();
    draw();
}

window.addEventListener("resize", () => {
    resize();
    draw();
});

goBtn.addEventListener("click", start);
resetBtn.addEventListener("click", reset);

const szVal = document.getElementById("sz-val");
const spdVal = document.getElementById("spd-val");

szInput.addEventListener("input", () => {
    szVal.textContent = szInput.value;
});

spdInput.addEventListener("input", () => {
    spdVal.textContent = spdInput.value;
});

resize();
genArr();
draw();
