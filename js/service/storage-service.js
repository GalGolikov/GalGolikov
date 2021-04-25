'use strict';

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}


function getMemesFromLocalStorage() {
    const memesArr = loadFromStorage('memes');
    return memesArr;
}

function saveMemesToLocalStorage(memes) {
    saveToStorage('memes', memes);
}

