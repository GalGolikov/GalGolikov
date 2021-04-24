'use script';

var gStartPos;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)

    gElCanvas.addEventListener('mousedown', onDown)

    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)

    gElCanvas.addEventListener('touchstart', onDown)

    gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
    if (gMeme.lines.length) {
        const pos = getEvPos(ev)
        setSelectedLine(pos);
        if (gMeme.selectedLineIdx === null) return;
        gMeme.lines[gMeme.selectedLineIdx].isDragging = true;
        gStartPos = pos;
        document.body.style.cursor = 'grabbing';
    }
}

function onMove(ev) {
    if (gMeme.lines.length) {
        if (gMeme.selectedLineIdx !== null) {
            const line = gMeme.lines[gMeme.selectedLineIdx];
            if (line.isDragging) {
                const pos = getEvPos(ev)
                const dx = pos.x - gStartPos.x
                const dy = pos.y - gStartPos.y
                line.x += dx
                line.y += dy
                gStartPos = pos
                renderLinesToCanvas()
            }
        }
    }
}

function onUp() {
    if (gMeme.lines.length) {
        if (gMeme.selectedLineIdx !== null) {
            gMeme.lines[gMeme.selectedLineIdx].isDragging = false
            document.body.style.cursor = 'grab'
        }
    }
}

function getEvPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function setSelectedLine(clickedPos) {
    let isLineClicked = false;
    gMeme.lines.forEach((line, index) => {
        const lineX = line.x;
        const lineY = line.y;
        const lineWidth = gCtx.measureText(line.txt).width;

        switch (line.align) {
            case 'center':
                let distance = Math.sqrt((lineX - clickedPos.x) ** 2 + (lineY - clickedPos.y) ** 2)
                if (distance <= lineWidth) {
                    selectLineForEdit(index);
                    isLineClicked = true;
                }
                break;
            case 'left':
                distance = Math.sqrt(((lineX - (lineWidth / 2)) - clickedPos.x) ** 2 + (lineY - clickedPos.y) ** 2)
                if (distance <= lineWidth) {
                    selectLineForEdit(index);
                    isLineClicked = true;
                }
                break;
            case 'right':
                distance = Math.sqrt(((lineX + (lineWidth / 2)) - clickedPos.x) ** 2 + (lineY - clickedPos.y) ** 2)
                if (distance <= lineWidth) {
                    selectLineForEdit(index);
                    isLineClicked = true;
                }
                break;
        }
    })
    if(!isLineClicked) resetLineSelection();
}


