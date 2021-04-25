'use strict';

// Global saved-memes-screen variables:
var gSavedMemes = getMemesFromLocalStorage() || [];

function onDeleteSavedMeme(idx) {
    gSavedMemes.splice(idx, 1);
    saveMemesToLocalStorage(gSavedMemes);
    // render updated page
}

function onEditSavedMeme(memeDetails) {
    gMeme = memeDetails;
    renderMemeEditScreen();
}

function getImgById(id) {
    return gImgs.find(img => img.id === id);
}