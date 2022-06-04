import GAME_SETTINGS from "../constants/gameSettings.js";

/** @type {CanvasRenderingContext2D} */
// let canvasContext = null;


/**
 * Init the canvas context that will be used on utils
 * @param {CanvasRenderingContext2D} newCanvasContext 
 */
//  init(newCanvasContext) {
//     canvasContext = newCanvasContext;
// };

export class Utility {
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    constructor(newCanvasContext) {
        this.canvasContext = newCanvasContext;
        this.previousObject = {};
    }

    hasCollided(object1, object2) {
        if (!object1 || !object2) {
            console.error('One of the objects in collision is not set');
            return false;
        }

        const object1BoxCollier = object1.getBoxCollider();
        const object2BoxCollier = object2.getBoxCollider();

        this.drawLine(
            object1BoxCollier.x,
            object1BoxCollier.y,
            object1BoxCollier.width,
            object1BoxCollier.height,
        );

        this.drawLine(
            object2BoxCollier.x,
            object2BoxCollier.y,
            object2BoxCollier.width,
            object2BoxCollier.height,
        )

        return (object1BoxCollier.x < (object2BoxCollier.x + object2BoxCollier.width) &&
                (object1BoxCollier.x + object1BoxCollier.width) > object2BoxCollier.x) &&
            (object1BoxCollier.y < (object2BoxCollier.y + object2BoxCollier.height) &&
                (object1BoxCollier.y + object1BoxCollier.height) > object2BoxCollier.y)
    }

    drawLine(x, y, width, height, color = "#F00", lineWidth = 1) {
        this.canvasContext.strokeStyle = color;
        this.canvasContext.lineWidth = lineWidth;
        this.canvasContext.strokeRect(
            x,
            y,
            width,
            height,
        );
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color Hex
     * @returns 
     */
    drawRectangle(x, y, width, height, color = "#000") {
        if (!this.canvasContext) {
            console.error('Context not defined');
            return;
        }

        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(Math.round(x), Math.round(y), width, height);
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
    drawText(text, x, y, color = "#fff", fontSize = "50px", fontFamily = "Arial") {
        if (!this.canvasContext) {
            console.error('Context not defined');
            return;
        }

        this.canvasContext.fillStyle = color;
        this.canvasContext.font = `${fontSize} ${fontFamily}`;
        this.canvasContext.fillText(text, Math.round(x), Math.round(y));
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
    drawRectangleWithGradient(x, y, width, height, color1 = "#000", color2 = "#444") {
        if (!this.canvasContext) {
            console.error('Context not defined');
            return;
        }

        this.canvasContext.fillStyle = createGradient(color1, color2);
        this.canvasContext.fillRect(Math.round(x), Math.round(y), width, height);
    }

    /**
     * @param {Array} elements 
     * @param {Number} numberOfElements 
     * @param {Boolean} validateIfIsTheSame 
     * @param {String} contextKey
     */
    getRandomElement(
        elements,
        numberOfElements,
        validateIfIsTheSame = false,
        contextKey = ''
    ) {
        const randomIndex = Math.floor(numberOfElements * Math.random());
        const random = elements[randomIndex];

        if (!validateIfIsTheSame) return random;

        if (this.isTheSameValue(contextKey, randomIndex)) {
            return this.getRandomElement(elements, numberOfElements, true, contextKey);
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
    drawImage(
        imagePath,
        x,
        y,
        width = 150,
        height = 150,
        valueToExcludeYOnClear = 0
    ) {
        let image = new Image();
        image.src = imagePath;

        // Draw first to "guarantee" this position on canvas
        // then draw again when the image is fully loaded
        // this.canvasContext.drawImage(image, x, y, width, height);

        image.onload = () => {
            if (!this.canvasContext) {
                console.error('Context not defined');
                return;
            }

            this.canvasContext.clearRect(
                Math.round(x),
                Math.round(y) + valueToExcludeYOnClear,
                width,
                height
            );
            this.canvasContext.drawImage(
                image,
                Math.round(x),
                Math.round(y),
                width,
                height
            );
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
    getRandomImage(
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
     * @param {number} x 
     * @param {number} y 
     * @param {number} width
     * @param {number} height 
     */
    clearRectUtil(x, y, width, height) {
        this.canvasContext.clearRect(Math.round(x), Math.round(y), width, height)
    }

    /**
     * @param {string} contextKey 
     * @param {Number} currentRandomIndex
     * @returns {Boolean}
     */
    isTheSameValue(contextKey, currentRandomIndex) {
        if (!this.previousObject.hasOwnProperty(contextKey)) {
            this.previousObject[contextKey] = currentRandomIndex;
            return false;
        }

        const result = this.previousObject[contextKey] === currentRandomIndex;

        if (!result) this.previousObject[contextKey] = currentRandomIndex;

        return result;
    }

    /**
     * @param {string} color1
     * @param {string} color2 
     * @returns {CanvasGradient}
     */
    createGradient(color1, color2) {
        const gradient = this.canvasContext.createLinearGradient(0, 0, 45, 0);

        gradient.addColorStop(1, color1);
        gradient.addColorStop(1, color2);

        return gradient;
    }
}