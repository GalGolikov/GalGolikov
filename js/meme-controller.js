'use strict';

// Global controller variables:
var gElCanvas;
var gElScreenContainer = document.getElementById('screen-container');;
var gCtx;
var gCurrColor = 'white';
var gCurrStroke = 'black';
var gCurrFont = 'impact';
var gCurrFontSize = 40;
var gMinFont = 30;
var gMaxFont = 100;
var gCurrAlignment = 'center';
var gImg;

function onInit() {
    renderGalleryScreen();
}

function renderGalleryScreen() {
    let imagesStrHTML = '';
    for (let i = 1; i <= gImgs.length; i++) {
        imagesStrHTML += `<img onclick="onSelectImg(this,${i})" src="img/meme-imgs(square)/${i}.jpg" alt="${i}.jpg"></img>`
    }
    const screenStrHTML = `<h4>Upload an image :</h4>
    <input type="file" class="file-input btn" name="image" onchange="onImgInput(event)" />
    <h3>OR</h3>
    <h4>Select from gallery :</h4>
    <section class="img-gallery">${imagesStrHTML}</section>`
    gElScreenContainer.innerHTML = screenStrHTML;
}

function renderMemeEditScreen() {
    const screenStrHTML = `<a href="#" class="btn" onclick="onBackToGallery()">Back to Gallery</button>
    <div class="inputs">
        <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
            <input name="img" id="imgData" type="hidden" />
            <button class="btn" type="submit">Publish</button>
            <a href="#" class="btn" onclick="downloadImg(this)" download="my-img.jpg">Download as jpeg</a>
            <div class="share-container"></div>
        </form>
    </div>
    <section class="control-box">
        <div class="color-container">
            <label for="color-picker">Choose a color :</label>
            <input onchange="onSetColor(this.value)" type="color" id="color-picker" value="#ffffff" />
            <label for="stroke-picker">Choose a stroke color :</label>
            <input onchange="onSetStroke(this.value)" type="color" id="stroke-picker" />
        </div>
        <div class="font-container"><label for="size-picker">Choose a font size :</label>
        <button onclick="onDecreaseFont()" class="font-minus"><i class="fas fa-minus"></i></button>
            <input onchange="onSetFontSize(this.value)" type="number" id="size-picker" min="${gMinFont}" max="${gMaxFont}"
                value="40" />
        <button onclick="onIncreaseFont()" class="font-plus"><i class="fas fa-plus"></i></button>
            <label for="font-picker">Choose a font :</label>
            <select onchange="onSetFont(this.value)" id="font-picker">
                <option value="impact" style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">Impact</option>
                <option value="verdana" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Verdana</option>
            </select>
        </div>
        <div class="align-container">
            <button class="align-left" onclick="onAlignLeft()"><i class="fas fa-align-left"></i></button>
            <button class="align-center" onclick="onAlignCenter()"><i class="fas fa-align-center"></i></button>
            <button class="align-right" onclick="onAlignRight()"><i class="fas fa-align-right"></i></button>
        </div>
        <div class="text-container"><input class="text-input" type="text" placeholder="Enter your text" />
            <button onclick="onAddText()">Add Text</button>
        </div>
        <button onclick="onClearCanvas()" class="clear">Clear All</button>
        <section class="canvas">
            <div class="canvas-container">
                <canvas id="my-canvas" height="450" width="450"></canvas>
            </div>
        </section>
    </section>`;
    gElScreenContainer.innerHTML = screenStrHTML;
    gElCanvas = document.getElementById('my-canvas');
    resizeCanvas();
    gCtx = gElCanvas.getContext('2d');
    renderCurrAlignPressed();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetWidth;
}

// ===== Gallery screen functions =====
function onSelectImg(elImg, imgId) {
    gMeme.selectedImgId = imgId;
    gImg = elImg;
    renderMemeEditScreen();
    renderImg();
}


function downloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    //document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()
    renderMemeEditScreen();
    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        gImg = img
    }
    reader.readAsDataURL(ev.target.files[0])
}

function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
}

// ===== Edit-meme screen functions =====
function renderImg(img = gImg) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}
function onSetColor(color) {
    gCurrColor = color;
}

function onSetStroke(strokeColor) {
    gCurrStroke = strokeColor;
}

function onSetFont(font) {
    gCurrFont = font;
}

function onSetFontSize(size) {
    gCurrFontSize = size;
}

function onIncreaseFont() {
    if (gCurrFontSize < gMaxFont) gCurrFontSize++;
    const elFontSizeInput = document.getElementById('size-picker');
    elFontSizeInput.value = gCurrFontSize;
}

function onDecreaseFont() {
    if (gCurrFontSize > gMinFont) gCurrFontSize--;
    const elFontSizeInput = document.getElementById('size-picker');
    elFontSizeInput.value = gCurrFontSize;
}

function onAlignLeft() {
    gCurrAlignment = 'left';
    renderCurrAlignPressed();
}

function onAlignCenter() {
    gCurrAlignment = 'center';
    renderCurrAlignPressed();
}

function onAlignRight() {
    gCurrAlignment = 'right';
    renderCurrAlignPressed();
}

// Show which alignment btn is currently effective ('pressed' class)
function renderCurrAlignPressed() {
    let elPrevPressed;
    switch (gCurrAlignment) {
        case 'left':
            elPrevPressed = document.querySelector('.pressed');
            if (elPrevPressed) elPrevPressed.classList.remove('pressed');
            document.querySelector('.align-left').classList.add('pressed');
            break;
        case 'center':
            elPrevPressed = document.querySelector('.pressed');
            if (elPrevPressed) elPrevPressed.classList.remove('pressed');
            document.querySelector('.align-center').classList.add('pressed');
            break;
        case 'right':
            elPrevPressed = document.querySelector('.pressed');
            if (elPrevPressed) elPrevPressed.classList.remove('pressed');
            document.querySelector('.align-right').classList.add('pressed');
            break;
    }
}

function onAddText() {
    const elTextInput = document.querySelector('.text-input');
    const txt = elTextInput.value;
    if (txt) {
        // TODO: handle line break according to text & canvas width
        const x = gCurrAlignment === 'left' ? 10 : gCurrAlignment === 'right' ? 440 : gElCanvas.width / 2
        let y;
        if (!gMeme.lines.length) {
            y = gCurrFontSize;
        } else if (gMeme.lines.length === 1) {
            y = 450 - (gCurrFontSize / 2);
        } else {
            y = gElCanvas.height / 2;
        }

        gMeme.lines.push({
            txt,
            size: gCurrFontSize,
            align: gCurrAlignment,
            color: gCurrColor,
            x,
            y,
            font: gCurrFont,
            stroke: gCurrStroke
        })
        drawText();
        elTextInput.value = '';
    }
}

function onClearCanvas() {
    gMeme.lines = [];
    clearCanvas();
}

function onBackToGallery() {
    renderGalleryScreen();
}

