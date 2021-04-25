'use strict';

function onInit() {
    renderGalleryScreen();
}

function renderSavedMemesScreen() {
    let content = '';
    if (gSavedMemes.length) {
        let savedMemesHTML = '';
        gSavedMemes.forEach((meme, index) => {
            // convert each meme to img elements
            let elImg = `
            <div>
                <img src="${meme.url}}"/>
                <button class="delete-meme-btn" onclick="onDeleteSavedMeme(${index})"><i class="fas fa-trash-alt"></i></button>
                <button class="edit-meme-btn" onclick="onEditSavedMeme(${meme.details})"><i class="fas fa-edit"></i></button>
            </div>`;
            savedMemesHTML += elImg;
        });
        content = savedMemesHTML;
    } else {
        content = `<span class="empty-state">No saved memes yet!</span>`;
    }
    const screenStrHTML = `<div class="saved-memes">${content}</div>`;
    gElScreenContainer.innerHTML = screenStrHTML;

    const elThisTab = document.querySelector('.saved-memes-tab');
    renderActiveTab(elThisTab);
}

function renderGalleryScreen() {
    const screenStrHTML = `<h4>Upload an image :</h4>
    <input type="file" class="file-input btn" name="image" onchange="onImgInput(event)" />
    <h3>OR</h3>
    <h4>Select from gallery :</h4>
    <section class="keywords-container"></section>
    <section class="img-gallery"></section>`;
    gElScreenContainer.innerHTML = screenStrHTML;
    renderImgsToGallery(gImgs);

    const elThisTab = document.querySelector('.gallery-tab');
    renderActiveTab(elThisTab);
    renderFilters();
}

function renderMemeEditScreen() {
    const screenStrHTML = `<div id="meme-edit-screen">
    <section class="control-box">
        <div class="color-container">
            <label for="color-picker">Fill:</label>
            <input onchange="onSetColor(this.value)" type="color" id="color-picker" value="#ffffff" />
            <label for="stroke-picker">Stroke:</label>
            <input onchange="onSetStroke(this.value)" type="color" id="stroke-picker" />
        </div>
        <div class="font-container">
            <div onclick="onDecreaseFont()" class="font-minus btn"><i class="fas fa-minus"></i></div>
            <input onchange="onSetFontSize(this.value)" type="number" id="size-picker" min="${gMinFont}" max="${gMaxFont}" value="40" />
            <div onclick="onIncreaseFont()" class="font-plus btn"><i class="fas fa-plus"></i></div>
            <select onchange="onSetFont(this)" id="font-picker" style="font-family:${gCurrFont}">
                <option value="impact" style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">Impact</option>
                <option value="verdana" style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Verdana</option>
                <option value="eurofurence" style="font-family: eurofurence;">Eurofurence</option>
                <option value="champange_limousines" style="font-family: champange_limousines;">Champange</option>
                <option value="lato" style="   font-family: lato;">Lato</option>
                </select>
        </div>
        <div class="align-container">
            <div class="align-left btn" onclick="onAlignLeft()"><i class="fas fa-align-left"></i></div>
            <div class="align-center btn" onclick="onAlignCenter()"><i class="fas fa-align-center"></i></div>
            <div class="align-right btn" onclick="onAlignRight()"><i class="fas fa-align-right"></i></div>
        </div>
        <div class="text-container"><input class="text-input" type="text" placeholder="Enter your text" />
            <div class="btn" onclick="onAddText()">Add Text</div>
        </div>
        <div class="clear-container">
            <div onclick="onClearCanvas()" class="clear btn">Clear All</div>
        </div>
        <div class="save-to-storage btn" onclick="onSaveToStorage()">Save Meme</div>
        <div class="inputs">
        <form action="" method="POST" enctype="multipart/form-data" onsubmit="uploadImg(this, event)">
            <input name="img" id="imgData" type="hidden" />
            <button class="btn" type="submit">Publish</button>
            <a href="#" class="btn" onclick="downloadImg(this)" download="my-img.jpg">Download as jpeg</a>
            <div class="share-container"></div>
        </form>
    </div>
        </section>
        <section class="canvas">
            <div class="canvas-container">
                <canvas id="my-canvas" height="450" width="450"></canvas>
            </div>
        </section></div>`;
    gElScreenContainer.innerHTML = screenStrHTML;
    gElCanvas = document.getElementById('my-canvas');
    gCtx = gElCanvas.getContext('2d');
    resizeCanvas();
    addListeners();
    renderCurrAlignPressed();
    // hammerCanvas();
    // remove prev active tab
    renderActiveTab();
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container');
    gElCanvas.width = elContainer.offsetWidth;
    gElCanvas.height = elContainer.offsetWidth;
}
