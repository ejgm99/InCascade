
var isCtrlPressed = false;
var isShiftPressed = false;
var isMetaPressed = false;
var isAltPressed = false;
var isEnterPressed = false;
var isSPressed = false;
var isCommandPressed = false;
var emitter = -1;
var isBackspacePressed = false;

export function setEmitter(e){
    emitter = e;
}

export function getBackspacePressed(){
    if(isBackspacePressed){
        isBackspacePressed = false;
        return true
    }
    return false;
}

export function handleKeyDown(e){
    if (e.key == 'Control') {
        isCtrlPressed = true;
    } else if (e.key == 'Shift') {
         isShiftPressed = true;
    } else if (e.key == 'Meta') {
        isMetaPressed = true;
    } else if (e.key == 'Alt') {
        isAltPressed = true;
    } else if (e.key === 'Enter') {
        isEnterPressed = true;
    } else if (e.key === 's') {
        isSPressed = true;
        if (isMetaPressed){
            e.preventDefault();
        } 
    } else if ((e.key) == 'Backspace'){
        isBackspacePressed = true;
    }
    if (isMetaPressed && isSPressed) {
        emitter.emit('save')
        console.log('save')
    }
}

export function handleKeyUp(e) {
    if (e.key === 'Meta') {
      isMetaPressed = false;
    } else if (e.key === 'Alt') {
      isOptionPressed = false;
    } else if (e.key === 'Control') {
      isControlPressed = false;
    } else if (e.key === 'Shift') {
      isShiftPressed = false;
    } else if (e.key === 'Enter') {
        isEnterPressed = false;
    } else if (e.key === 's') {
        isSPressed = false;
    }
}