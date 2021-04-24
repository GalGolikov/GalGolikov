'use strict';

// Global utils variables:
var gElmodal = document.querySelector('.modal');

// ===== Modal functions =====
function renderModal(headline, txt, time) {
    // Add the txt to the modal
    const elModalHeadline = document.querySelector('.modal-headline')
    const elModalTxt = document.querySelector('.modal-txt');
    elModalHeadline.innerHTML = headline;
    elModalTxt.innerHTML = txt;

    // Show modal for x time then hide again
    const elModal = document.querySelector('.modal');
    elModal.hidden = false;
    setInterval(() => {
        elModal.hidden = true;
    }, time);
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target === gElmodal) {
        gElmodal.hidden = true;
    }
}

function onCloseModal() {
    gElmodal.hidden = true;
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

function onScrollToFooter() {
    // scroll to footer
}

