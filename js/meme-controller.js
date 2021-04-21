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

function renderSavedMemesScreen() {
    const savedMemesArr = getMemesFromLocalStorage() || [];
    let content = '';
    if (savedMemesArr.length) {
        let savedMemesHTML = '';
        console.log(savedMemesArr);
        for (let i = 1; i <= savedMemesArr.length; i++) {
            // convert each meme to img elements
            let elImg = `<img src="${savedMemesArr[i]}}"></img>`
            savedMemesHTML += elImg;
        }
        content = savedMemesHTML;
    } else {
        content = `<span class="empty-state">No saved memes yet!</span>`
    }

    const screenStrHTML = `<div class="saved-memes">${content}</div>`
    gElScreenContainer.innerHTML = screenStrHTML;
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
    const screenStrHTML = `<div class="inputs">
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
            <select onchange="onSetFont(this)" id="font-picker" style="font-family:${gCurrFont}">
                <option value="impact" style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">Impact</option>
                <option value="verdana" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Verdana</option>
                <option value="eurofurence" style="font-family: eurofurence;">Eurofurence</option>
                <option value="champange_limousines" style="font-family: champange_limousines;">Champange limousines</option>
                <option value="lato" style="   font-family: lato;">Lato</option>
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
        <div class="clear-container">
            <button onclick="onClearCanvas()" class="clear">Clear All</button>
        </div>
        <button class="save-to-storage" onclick="onSaveToStorage()">Save Meme</button>
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
    hammerCanvas();
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
    // If a line is selected - change its color
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].color = color;
        renderLinesToCanvas();
    }
    gCurrColor = color;
}

function onSetStroke(strokeColor) {
    // If a line is selected - change its stroke color
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].stroke = strokeColor;
        renderLinesToCanvas();
    }
    gCurrStroke = strokeColor;
}

function onSetFont(elSelect) {
    // If a line is selected - change its font
    const font = elSelect.value;
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].font = font;
        // TODO: call adjustTextToFitCanvas();
        renderLinesToCanvas();
    }
    gCurrFont = font;
    elSelect.style.fontFamily = font;
}

function onSetFontSize(size) {
    // If a line is selected - change its font size
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].size = size;
        // TODO: call adjustTextToFitCanvas();
        // TODO: call adjustStrokeToFontSize();
        renderLinesToCanvas();
    }
    gCurrFontSize = size;
}

function onIncreaseFont() {
    // If a line is selected - change its font size
    if (gMeme.selectedLineIdx !== null) {
        if (gMeme.lines[gMeme.selectedLineIdx].size < gMaxFont) {
            gMeme.lines[gMeme.selectedLineIdx].size++;
            // TODO: call adjustTextToFitCanvas();
            // TODO: call adjustStrokeToFontSize();
            renderLinesToCanvas();
        }
    }
    if (gCurrFontSize < gMaxFont) gCurrFontSize++;
    const elFontSizeInput = document.getElementById('size-picker');
    elFontSizeInput.value = gCurrFontSize;
}

function onDecreaseFont() {
    // If a line is selected - change its font size
    if (gMeme.selectedLineIdx !== null) {
        if (gMeme.lines[gMeme.selectedLineIdx].size > gMinFont) {
            gMeme.lines[gMeme.selectedLineIdx].size--;
            // TODO: call adjustTextToFitCanvas();
            // TODO: call adjustStrokeToFontSize();
            renderLinesToCanvas();
        }
    }
    if (gCurrFontSize > gMinFont) gCurrFontSize--;
    const elFontSizeInput = document.getElementById('size-picker');
    elFontSizeInput.value = gCurrFontSize;
}

function onAlignLeft() {
    // If a line is selected - change its alignment
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].align = 'left';
        gMeme.lines[gMeme.selectedLineIdx].x = 10;
        // TODO: call adjustTextToFitCanvas();
        renderLinesToCanvas();
    }
    gCurrAlignment = 'left';
    renderCurrAlignPressed();
}

function onAlignCenter() {
    // If a line is selected - change its alignment
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].align = 'center';
        gMeme.lines[gMeme.selectedLineIdx].x = gElCanvas.width / 2;
        // TODO: call adjustTextToFitCanvas();
        renderLinesToCanvas();
    }
    gCurrAlignment = 'center';
    renderCurrAlignPressed();
}

function onAlignRight() {
    // If a line is selected - change its alignment
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].align = 'right';
        gMeme.lines[gMeme.selectedLineIdx].x = 440;
        // TODO: call adjustTextToFitCanvas();
        renderLinesToCanvas();
    }
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
        const x = gCurrAlignment === 'left' ? 10 : gCurrAlignment === 'right' ? 440 : gElCanvas.width / 2
        let y;
        if (!gMeme.lines.length) {
            y = gCurrFontSize;
        } else if (gMeme.lines.length === 1) {
            y = 450 - (gCurrFontSize / 2);
        } else {
            y = gElCanvas.height / 2;
        }
        const newLine = {
            txt,
            size: gCurrFontSize,
            align: gCurrAlignment,
            color: gCurrColor,
            x,
            y,
            font: gCurrFont,
            stroke: gCurrStroke,
            isDragging: false,
        }
        gMeme.lines.push(newLine)
        renderLinesToCanvas();
        elTextInput.value = '';
        // TODO: call function adjustLineBreakers()
    }
}

function onClearCanvas() {
    gMeme.lines = [];
    clearCanvas();
    resetLineSelection();
}

function onSaveToStorage() {
    const meme = `data:image/jpeg;base64,${getBase64Image(gElCanvas)}`;
    saveMemeToLocalStorage(meme);
    // TODO: show "saved" popup modal for few sec & remove
    renderGalleryScreen();
}

function renderLinesToCanvas() {
    clearCanvas();
    if (gMeme.lines.length) {
        gMeme.lines.forEach((line, index) => {
            if (index === gMeme.selectedLineIdx) {
                // show selected appearance
                drawSelectedLineBox(line);
            } else {
                gCtx.lineWidth = 2
                gCtx.strokeStyle = line.stroke;
                gCtx.fillStyle = line.color;
                gCtx.font = `${line.size}px ${line.font}`
                gCtx.textAlign = line.align;
                gCtx.fillText(line.txt, line.x, line.y)
                gCtx.strokeText(line.txt, line.x, line.y)
            }
        });
    }
}

function getBase64Image(img) {
    gElCanvas.width = img.width;
    gElCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0);
    const dataURL = gElCanvas.toDataURL("image/jpeg");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

// ===== Nav bar functions =====
function onGoToSavedMemes() {
    resetLinesModel();
    renderSavedMemesScreen();
    resetLineSelection();
}

function onGoToGallery() {
    resetLinesModel();
    renderGalleryScreen();
    resetLineSelection();
}
