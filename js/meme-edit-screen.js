'use strict';

// Global meme-edit-screen variables:
var gElCanvas;
var gElScreenContainer = document.getElementById('screen-container');
var gCtx;
var gCurrColor = 'white';
var gCurrStroke = 'black';
var gCurrFont = 'impact';
var gCurrFontSize = 40;
var gMinFont = 30;
var gMaxFont = 100;
var gCurrAlignment = 'center';
var gImg;

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

function downloadImg(elLink) {
    var imgContent = gElCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent;
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
        renderLinesToCanvas();
    }
    gCurrFont = font;
    elSelect.style.fontFamily = font;
}

function onSetFontSize(size) {
    // If a line is selected - change its font size
    if (gMeme.selectedLineIdx !== null) {
        gMeme.lines[gMeme.selectedLineIdx].size = size;
        renderLinesToCanvas();
    }
    gCurrFontSize = size;
}

function onIncreaseFont() {
    // If a line is selected - change its font size
    if (gMeme.selectedLineIdx !== null) {
        if (gMeme.lines[gMeme.selectedLineIdx].size < gMaxFont) {
            gMeme.lines[gMeme.selectedLineIdx].size++;
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
        const x = gCurrAlignment === 'left' ? 10 : gCurrAlignment === 'right' ? gElCanvas.width - 10 : gElCanvas.width / 2;
        let y;
        if (!gMeme.lines.length) {
            y = gCurrFontSize;
        } else if (gMeme.lines.length === 1) {
            y = gElCanvas.height - (gCurrFontSize / 2);
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
        };
        gMeme.lines.push(newLine);
        renderLinesToCanvas();
        elTextInput.value = '';
    }
}

function onClearCanvas() {
    gMeme.lines = [];
    clearCanvas();
    resetLineSelection();
}

function onSaveToStorage() {
    const meme = JSON.parse(JSON.stringify(gMeme));
    gSavedMemes.push(meme);
    saveMemesToLocalStorage(gSavedMemes);

    // Show "saved" popup modal for few sec & remove
    renderModal('Saved meme successfully!', 'You can see it in the saved memes tab :)', 5000);
    onGoToGallery();
}

function renderLinesToCanvas() {
    clearCanvas();
    if (gMeme.lines.length) {
        gMeme.lines.forEach((line, index) => {
            if (index === gMeme.selectedLineIdx) {
                // show selected appearance
                drawSelectedLineBox(line);
            } else {
                gCtx.lineWidth = 2;
                gCtx.strokeStyle = line.stroke;
                gCtx.fillStyle = line.color;
                gCtx.font = `${line.size}px ${line.font}`;
                gCtx.textAlign = line.align;
                gCtx.fillText(line.txt, line.x, line.y);
                gCtx.strokeText(line.txt, line.x, line.y);
            }
        });
    }
}