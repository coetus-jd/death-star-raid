import GAME_SETTINGS from "../constants/gameSettings.js";

/** @type {CanvasRenderingContext2D} */
let canvasContext = null;
let previousObject = {};

/**
 * Init the canvas context that will be used on utils
 * @param {CanvasRenderingContext2D} newCanvasContext 
 */
export function init(newCanvasContext) {
    canvasContext = newCanvasContext;
};

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color Hex
 * @returns 
 */
export function drawRectangle(x, y, width, height, color = "#000") {
    if (!canvasContext) {
        console.error('Context not defined');
        return;
    }

    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
}

/**
 * @param {String} text 
 * @param {Number} x 
 * @param {Number} y 
 * @param {String} color 
 * @param {String} fontSize 
 * @param {String} fontFamily 
 * @returns 
 */
export function drawText(text, x, y, color = "#fff", fontSize = "50px", fontFamily = "Arial") {
    if (!canvasContext) {
        console.error('Context not defined');
        return;
    }

    canvasContext.fillStyle = color;
    canvasContext.font = `${fontSize} ${fontFamily}`;
    canvasContext.fillText(text, x, y);
}

/**
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @param {string} color1 Hex
 * @param {string} color2 Hex
 * @returns 
 */
export function drawRectangleWithGradient(x, y, width, height, color1 = "#000", color2 = "#444") {
    if (!canvasContext) {
        console.error('Context not defined');
        return;
    }

    canvasContext.fillStyle = createGradient(color1, color2);
    canvasContext.fillRect(x, y, width, height);
}

/**
 * @param {Array} elements 
 * @param {Number} numberOfElements 
 * @param {Boolean} validateIfIsTheSame 
 * @param {String} contextKey
 */
export function getRandomElement(
    elements,
    numberOfElements,
    validateIfIsTheSame = false,
    contextKey = ''
) {
    const random = elements[Math.floor(numberOfElements * Math.random())];

    if (!validateIfIsTheSame) return random;

    if (isTheSameValue(contextKey, random)) {
        getRandomElement(elements, numberOfElements, true, contextKey);
    }

    return random;
}

/**
 * @param {string} imagePath 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width
 * @param {number} height 
 */
export function drawImage(
    imagePath,
    x,
    y,
    width = 150,
    height = 150,
    clearRect = true
) {
    let image = new Image();
    image.src = imagePath;

    // Draw first to "guarantee" this position on canvas
    // then draw again when the image is fully loaded
    canvasContext.drawImage(image, x, y, width, height);

    image.onload = function() {
        if (clearRect) canvasContext.clearRect(x, y, width, height);
        canvasContext.drawImage(image, x, y, width, height);
    }
    image.onerror = function(error) { console.log(error) }
}

/**
 * @param {string} basePath 
 * @param {number} numberOfImages 
 * @param {string} imageFileExtension 
 * @param {number} quantityOfNumbers 
 * @returns {string}
 */
export function getRandomImage(
    basePath,
    numberOfImages,
    imageFileExtension = '.png',
    quantityOfNumbers = 4
) {
    const value = Math.floor(Math.random() * numberOfImages);
    const allNumbers = value.toString().padStart(quantityOfNumbers, '0');

    return `${basePath}/${allNumbers}${imageFileExtension}`;
}

/**
 * @param {string} contextKey 
 * @param {Number | String} currentRandomValue
 * @returns 
 */
function isTheSameValue(contextKey, currentRandomValue) {
    if (!previousObject.hasOwnProperty(contextKey)) {
        previousObject[contextKey] = '';
        return false;
    }

    const result = previousObject[contextKey] === currentRandomValue;

    if (!result) previousObject[contextKey] = currentRandomValue;

    return result;
}

/**
 * @param {string} color1
 * @param {string} color2 
 * @returns {CanvasGradient}
 */
function createGradient(color1, color2) {
    const gradient = canvasContext.createLinearGradient(0, 0, 45, 0);

    gradient.addColorStop(1, color1);
    gradient.addColorStop(1, color2);

    return gradient;
}