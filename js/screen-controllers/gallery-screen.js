'use strict';

// Global gallery-screen variables:
var gMinKeywordSize = 16;
var gMaxKeywordSize = 40;

// ===== Gallery screen functions =====
function onSelectImg(elImg, imgId) {
    gMeme.selectedImgId = imgId;
    gImg = elImg;
    renderMemeEditScreen();
    renderImg();
}


// The next 2 functions handle IMAGE UPLOADING to img tag from file system: 
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg);
}

function loadImageFromInput(ev, onImageReady) {
    //document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    renderMemeEditScreen();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img);
        img.src = event.target.result;
        gImg = img;
    };
    reader.readAsDataURL(ev.target.files[0]);
}

function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas);
}


function renderFilters() {
    let keywordsStrHTML = '';
    for (let keyword in gKeywords) {
        keywordsStrHTML += `<span class="keyword" onclick="onClickKeyword(this)" data-count="${gKeywords[keyword]}">${keyword}</span>`;
    }
    const elKeywordsContainer = document.querySelector('.keywords-container');
    elKeywordsContainer.innerHTML = keywordsStrHTML;
    renderKeywordSizeByCount();
}

function renderKeywordSizeByCount() {
    const elKeywordsList = document.getElementsByClassName('keyword');
    for (let elKeyword of elKeywordsList) {
        // Get count and set size accordingly
        let count = elKeyword.getAttribute('data-count');
        let size = gMinKeywordSize + (count - count / 2);
        elKeyword.style.fontSize = `${size < gMaxKeywordSize ? size : gMaxKeywordSize}px`;
    }
}

function onClickKeyword(elKeyword) {
    const keyword = elKeyword.innerHTML;
    filterGallery(keyword);
    // Enlarge the font size
    gKeywords[keyword]++;
    renderKeywordSizeByCount();
}

function filterGallery(keyword) {
    // filter gallery imgs
    const filteredImgs = gImgs.filter((img) => img.keywords.includes(keyword));
    if (filteredImgs.length) renderImgsToGallery(filteredImgs);
}

function renderImgsToGallery(imgs) {
    let imagesStrHTML = '';
    imgs.forEach(img => {
        imagesStrHTML += `<img onclick="onSelectImg(this,${img.id})" src="${img.url}" alt="${img.id}.jpg"></img>`;
    });
    const elImgGallery = document.querySelector('.img-gallery');
    elImgGallery.innerHTML = imagesStrHTML;
}