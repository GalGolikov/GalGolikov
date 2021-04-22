'use strict';

function hammerCanvas() {
    const hammer = new Hammer(gElCanvas);
    // add a "PAN" recognizer to it (all directions)
    hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 15 }));
    hammer.on('pan', handleDrag);
    hammer.on('tap press', handleTapPress);
}

function handleDrag(ev) {
    ev.preventDefault();
    resetLineSelection();
    const offsetX = ev.srcEvent.offsetX
    const offsetY = ev.srcEvent.offsetY
    setSelectedLine(offsetX, offsetY);
    if (gMeme.selectedLineIdx === null) return;
    // Line was targeted - update dragging
    renderLinesToCanvas();
    gMeme.lines[gMeme.selectedLineIdx].isDragging = true
    gElCanvas.style.cursor = 'grabbing'

    const posX = ev.deltaX + gMeme.lines[gMeme.selectedLineIdx].x;
    const posY = ev.deltaY + gMeme.lines[gMeme.selectedLineIdx].y;

    // move our element to that position
    gMeme.lines[gMeme.selectedLineIdx].x = posX;
    gMeme.lines[gMeme.selectedLineIdx].y = posY;

    // DRAG ENDED
    // this is where we simply forget we are dragging
    if (ev.isFinal) {
        gMeme.lines[gMeme.selectedLineIdx].isDragging = false;
        renderLinesToCanvas();
        gElCanvas.style.cursor = 'grab'
    }
}

function handleTapPress(ev) {
    ev.preventDefault();
    resetLineSelection();
    const offsetX = ev.srcEvent.offsetX
    const offsetY = ev.srcEvent.offsetY
    setSelectedLine(offsetX, offsetY);
    if (gMeme.selectedLineIdx === null) return;
    // Line was targeted
    renderLinesToCanvas();
}

function setSelectedLine(clickedX, clickedY) {
    gMeme.lines.forEach((line, index) => {
        const lineX = line.x;
        const lineY = line.y;
        const lineWidth = gCtx.measureText(line.txt).width;

        if (line.align === 'center') {
            const distance = Math.sqrt((lineX - clickedX) ** 2 + (lineY - clickedY) ** 2)
            if (distance <= lineWidth) selectLineForEdit(index);
        }
        else if (line.align === 'left') {
            const distance = Math.sqrt(((lineX - (lineWidth / 2)) - clickedX) ** 2 + (lineY - clickedY) ** 2)
            if (distance <= lineWidth) selectLineForEdit(index);
        } else if (line.align === 'right') {
            const distance = Math.sqrt(((lineX + (lineWidth / 2)) - clickedX) ** 2 + (lineY - clickedY) ** 2)
            if (distance <= lineWidth) selectLineForEdit(index);
        }
    })
}