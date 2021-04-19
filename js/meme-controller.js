'use strict';

var gElCanvas;
var gElScreenContainer = document.getElementById('screen-container');;
var gCtx;
var gCurrColor;


function onInit() {
    renderGalleryScreen();
}

function renderGalleryScreen() {
    let imagesStrHTML = '';
    for (let i = 1; i <= gImgs.length; i++) {
        imagesStrHTML += `<img onclick="onSelectImg(this,${i})" src="img/meme-imgs(square)/${i}.jpg" alt="${i}.jpg"></img>`
    }
    const screenStrHTML = `<section class="img-gallery">
    ${imagesStrHTML}
    </section>`
    gElScreenContainer.innerHTML = screenStrHTML;
}

function renderMemeEditScreen() {
    const screenStrHTML = `<div class="inputs">
<input type="file" class="file-input btn" name="image" onchange="onImgInput(event)" />
<form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
  <input name="img" id="imgData" type="hidden" />
  <button class="btn" type="submit">Publish</button>
  <a href="#" class="btn" onclick="downloadImg(this)" download="my-img.jpg">Download as jpeg</a>
  <div class="share-container"></div>
</form>
</div>
<section class="control-box">
<label for="color">Choose a color :</label>
<input onchange="onSetColor(this.value)" type="color" name="color-picker"/>
<input class="text-input" type="text" placeholder="Enter your text"/>
<button onclick="onAddText()">Add Text</button>
<button onclick="onClearCanvas()" class="clear">Clear</button>
<section class="canvas">
    <div class="canvas-container">
        <canvas id="my-canvas" height="450" width="450" ></canvas>
    </div>
</section>
</section>`;
    gElScreenContainer.innerHTML = screenStrHTML;
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    renderImg();
}

function onSelectImg(elImg, imgId) {
    gMeme.selectedImgId = imgId;
    gMeme.selectedElImg = elImg;
    renderMemeEditScreen();
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
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader()

    reader.onload = function (event) {
        var img = new Image()
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result
        gImg = img
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img = gMeme.selectedElImg) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
}

function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
}

function onSetColor(color) {
    gCurrColor = color;
}

function onAddText() {
    const elTextInput = document.querySelector('.text-input');
    const text = elTextInput.value;
    drawText(text);
}

function onClearCanvas() {
    clearCanvas();
}