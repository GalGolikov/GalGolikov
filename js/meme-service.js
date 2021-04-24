'use strict';

// Global model variables:
var gKeywords = { 'funny': 12, 'cute': 3, 'tv': 12, 'politics': 3, 'sleep': 2, 'tough': 3, 'kids': 4, 'kiss': 2 }
var gImgs = [{ id: 1, url: 'img/meme-imgs(square)/1.jpg', keywords: ['funny', 'tv', 'politics'] },
{ id: 2, url: 'img/meme-imgs(square)/2.jpg', keywords: ['animals', 'cute', 'kiss'] },
{ id: 3, url: 'img/meme-imgs(square)/3.jpg', keywords: ['animals', 'cute', 'kids', 'sleep'] },
{ id: 4, url: 'img/meme-imgs(square)/4.jpg', keywords: ['animals', 'cute', 'sleep'] },
{ id: 5, url: 'img/meme-imgs(square)/5.jpg', keywords: ['funny', 'kids'] },
{ id: 6, url: 'img/meme-imgs(square)/6.jpg', keywords: ['funny', 'tv'] },
{ id: 7, url: 'img/meme-imgs(square)/7.jpg', keywords: ['kids', 'funny'] },
{ id: 8, url: 'img/meme-imgs(square)/8.jpg', keywords: ['funny', 'tv'] },
{ id: 9, url: 'img/meme-imgs(square)/9.jpg', keywords: ['funny', 'kids'] },
{ id: 10, url: 'img/meme-imgs(square)/10.jpg', keywords: ['funny', 'tv', 'politics'] },
{ id: 11, url: 'img/meme-imgs(square)/11.jpg', keywords: ['funny', 'tv', 'tough', 'kiss'] },
{ id: 12, url: 'img/meme-imgs(square)/12.jpg', keywords: ['funny', 'tv'] },
{ id: 13, url: 'img/meme-imgs(square)/13.jpg', keywords: ['funny', 'tv'] },
{ id: 14, url: 'img/meme-imgs(square)/14.jpg', keywords: ['tough', 'tv'] },
{ id: 15, url: 'img/meme-imgs(square)/15.jpg', keywords: ['funny', 'tv'] },
{ id: 16, url: 'img/meme-imgs(square)/16.jpg', keywords: ['funny', 'tv'] },
{ id: 17, url: 'img/meme-imgs(square)/17.jpg', keywords: ['tough', 'tv', 'politics'] },
{ id: 18, url: 'img/meme-imgs(square)/18.jpg', keywords: ['funny', 'tv', 'kids'] }];
var gMeme = {
    selectedImgId: null,
    selectedLineIdx: null,
    lines: []
}

//UPLOAD IMG WITH INPUT FILE
function handleImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}


// on submit call to this function
function uploadImg(elForm, ev) {
    ev.preventDefault();

    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('uploadedImgUrl', uploadedImgUrl);

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (response) {
            return response.text()
        })
        .then(onSuccess)
        .catch(function (error) {
            console.error(error)
        })
}


function drawSelectedLineBox(lineObj) {
    const lineWidth = gCtx.measureText(lineObj.txt).width;
    gCtx.rect(lineWidth, lineWidth, lineObj.size, lineObj.size, 20);
    gCtx.fillStyle = "#88deff7a";
    const rectY = lineObj.y - lineObj.size - 5;
    let rectX;
    switch (lineObj.align) {
        case 'center':
            rectX = lineObj.x - (lineWidth / 2) - 5;
            break;
        case 'right':
            rectX = lineObj.x - lineWidth - 5;
            break;
        case 'left':
            rectX = lineObj.x - 5;
    }
    gCtx.fillRect(rectX, rectY, lineWidth + 15, lineObj.size + 15);
    gCtx.strokeStyle = '#ffffff';
    gCtx.strokeRect(rectX, rectY, lineWidth + 15, lineObj.size + 15);

    // text
    gCtx.lineWidth = 2;
    gCtx.strokeStyle = lineObj.stroke;
    gCtx.fillStyle = lineObj.color;
    gCtx.font = `${lineObj.size}px ${lineObj.font}`
    gCtx.textAlign = lineObj.align;
    gCtx.fillText(lineObj.txt, lineObj.x, lineObj.y)
    gCtx.strokeText(lineObj.txt, lineObj.x, lineObj.y)
}

function clearCanvas() {
    if (gCtx) {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
        renderImg();
    }
}

function resetLinesModel() {
    gMeme.lines = [];
}

function selectLineForEdit(lineIdx) {
    gMeme.selectedLineIdx = lineIdx;
    // add clear line btn
    const elClearLineBtn = document.querySelector('.clear-selected');
    if (!elClearLineBtn) {
        const btnHTML = `<div onclick="clearSelectedLine()" class="clear-selected btn"><i class="fas fa-trash-alt"></i></div>`;
        const elClearContainer = document.querySelector('.clear-container');
        elClearContainer.innerHTML += btnHTML;
        renderLinesToCanvas();
    }
}

function resetLineSelection() {
    gMeme.selectedLineIdx = null;
    // remove clear selected line btn
    const elClearLineBtn = document.querySelector('.clear-selected');
    if (elClearLineBtn) elClearLineBtn.remove();
    renderLinesToCanvas();
}

function clearSelectedLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    renderLinesToCanvas();
    resetLineSelection();
}

// facebook api
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));