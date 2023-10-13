let isMouseDown = false;
let isErasing = false;
let firstFrame = true;
let colorHue = 0;
let colorSaturation = 0;
let colorLightness = 50;
let isColor = false;

const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };

const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      Math.floor((100 * (2 * l - s)) / 2),
    ];
  };


const extractFromColorString = (colorString)  => {
    return colorString.match(/[0-9]+/g).map(e => parseInt(e));
}

function init() {

    createGrid(30);

    document.body.addEventListener("keydown", (event) => {if (event.key == "e") {toggleEraser()}})
    document.body.addEventListener("keydown", (event) => {if (event.key == "c") {toggleColor()}})
    document.body.addEventListener("keydown", (event) => {if (event.key == "C") {unToggleColor()}})
}


function toggleEraser() {
    if (isMouseDown) {
        toggleDraw();
    }
    if (!isErasing) {
        document.getElementById("isErasing").style.color = "#000000";
        isErasing = !isErasing;
    }
    else {
        document.getElementById("isErasing").style.color = "#c8c8c8";
        isErasing = !isErasing;
    }
}

function toggleDraw() {
    if (isErasing) {
        toggleEraser();
    }
    let isActive = document.getElementById("isActive");
    if (!isMouseDown) {
    
    isActive.style.color = "#000000";
    }
    else {
        isActive.style.color = "#c8c8c8";
    }
    isMouseDown = !isMouseDown;
}

function toggleColor() {
    if (isColor) {
        document.getElementById("color").style.color = "rgb(200,200,200)"
    }
    else {
        console.log(`hsl(${colorHue}, ${colorSaturation}%, ${colorLightness}%)`)
        document.getElementById("color").style.color = `hsl(${colorHue}, ${colorSaturation}%, ${colorLightness}%)`
    }
    isColor = !isColor;

    

}

function unToggleColor() {
    isColor = true;
    colorHue = Math.floor(Math.random() * (360));
    colorSaturation = Math.floor(Math.random() * (100 - 30) + 30);
    colorLightness = 50;
    colorUpdate();

}

function colorSliderMove() {
    colorHue = document.getElementById("colorHueSlider").value;
    colorLightness = document.getElementById("colorLigSlider").value;
    colorSaturation = document.getElementById("colorSatSlider").value;
    colorUpdate();
    
}

function getDarkerShade(hslString) {
    let dl = -10;
    let newValues = extractFromColorString(hslString);
    newValues = RGBToHSL(...newValues);
    (newValues[2] + dl < 0) ? newValues[2] = 0 : newValues[2] += dl;
    return `hsl(${newValues[0]}, ${newValues[1]}%, ${newValues[2]}%)`
}

function createGrid(size) {
    if (!firstFrame) {
        document.getElementById("frame").remove()
    }
    
    let frame = document.createElement("div")
    frame.addEventListener("click", toggleDraw);
    frame.id = "frame";
    frame.classList.add("frame")
    const frameSize = window.innerHeight - 50;
    frame.style.width = `${frameSize}px`
    frame.style.height = `${frameSize}px`;

    for (let i = 0; i < size*size; i++) {
        let square = document.createElement("div");
        let squareSide = (frameSize / size)
        square.classList.add("square")
        
        square.style.width = `${squareSide}px`;
        square.style.height = `${squareSide}px`;
        square.addEventListener("mouseover", onMouseOver);


        frame.appendChild(square)
    }

    document.body.appendChild(frame)
    firstFrame = false;
}

function newGrid() {
    let gridSize = document.getElementById("gridSize").value;
    if (gridSize > 64) {
        document.getElementById("gridSizeExceeded").style.visibility = "visible";
    }
    else {
        document.getElementById("gridSizeExceeded").style.visibility = "hidden";
        createGrid(gridSize);
    }
}

function onMouseOver(event) {
    let square = event.target;

    if (isMouseDown) {

        let originalColor = getComputedStyle(square).getPropertyValue("background-color");
        if (!isColor)
        {
        square.style.backgroundColor = getDarkerShade(originalColor)}
        else {
            square.style.backgroundColor = `hsl(${colorHue}, ${colorSaturation}%, ${colorLightness}%)`
            
        }
    }
    if (isErasing) {
        square.style.backgroundColor = "hsl(0,0%,100%)";
    }

}

function colorUpdate() {
    document.getElementById("colorHueSlider").value = colorHue;
    document.getElementById("colorLigSlider").value = colorLightness;
    document.getElementById("colorSatSlider").value = colorSaturation;
    document.getElementById("color").style.color = `hsl(${colorHue}, ${colorSaturation}%, ${colorLightness}%)`
    document.getElementById("hueValue").innerText = colorHue;
    document.getElementById("saturationValue").innerText = colorSaturation + "%";
    document.getElementById("lightnessValue").innerText = colorLightness + "%";
    document.getElementById("color").style.color = `hsl(${colorHue}, ${colorSaturation}%, ${colorLightness}%)`;

}

init();







