'use strict';

// ===== Gallery screen functions =====
function onSelectImg(elImg, imgId) {
    gMeme.selectedImgId = imgId;
    gImg = elImg;
    renderMemeEditScreen();
    renderImg();
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