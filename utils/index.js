import { Log } from "./log.js";
import GAME_SETTINGS from "../constants/gameSettings.js";

/**
 * Class with some utilities to work on a canvas context
 * @author Fabrício Pinto Ferreira
 */
export class Utility {
  /**
   * @param {CanvasRenderingContext2D} newContext
   */
  constructor(newCanvasContext) {
    /** @type {CanvasRenderingContext2D} */
    this.canvasContext = newCanvasContext;
    /**
     * Object to be used to store values in the @function isTheSameValue
     */
    this.previousObject = {};
  }

  /**
   * Verify if two objects have collided
   * 
   * @param {import('../types').Tile} object1
   * @param {import('../types').Tile} object2
   * @returns
   */
  hasCollided(object1, object2) {
    if (!object1 || !object2) {
      Log.error("One of the objects in collision is not set");
      return false;
    }

    /** @type {import('../types').Collider} */
    const object1BoxCollier = object1.getBoxCollider();
    /** @type {import('../types').Collider} */
    const object2BoxCollier = object2.getBoxCollider();

    if (!object1BoxCollier || !object2BoxCollier) {
      Log.error("One of the objects in collision has not set their box collider");
      return false;
    }

    if (GAME_SETTINGS.DEBUG.DEBUG_ENABLED) {
      this.drawLine(
        object1BoxCollier.x,
        object1BoxCollier.y,
        object1BoxCollier.width,
        object1BoxCollier.height
      );

      this.drawLine(
        object2BoxCollier.x,
        object2BoxCollier.y,
        object2BoxCollier.width,
        object2BoxCollier.height
      );
    }

    return (
      object1BoxCollier.x < object2BoxCollier.x + object2BoxCollier.width &&
      object1BoxCollier.x + object1BoxCollier.width > object2BoxCollier.x &&
      object1BoxCollier.y < object2BoxCollier.y + object2BoxCollier.height &&
      object1BoxCollier.y + object1BoxCollier.height > object2BoxCollier.y
    );
  }

  /**
   * Draw a line on canvas
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   * @param {string} color Color in Hex
   * @param {number} lineWidth 
   */
  drawLine(x, y, width, height, color = "#F00", lineWidth = 1) {
    this.canvasContext.beginPath();
    this.canvasContext.strokeStyle = color;
    this.canvasContext.lineWidth = lineWidth;
    this.canvasContext.strokeRect(x, y, width, height);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {string} color Color in Hex
   * @returns {void}
   */
  drawRectangle(x, y, width, height, color = "#000") {
    if (!this.canvasContext) {
      Log.error("Context not defined");
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
   * @returns {void}
   */
  drawText(
    text,
    x,
    y,
    color = "#fff",
    fontSize = "50px",
    fontFamily = "Arial"
  ) {
    if (!this.canvasContext) {
      Log.error("Context not defined");
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
   * @param {string} color1 Color in Hex
   * @param {string} color2 Color in Hex
   * @returns {void}
   */
  drawRectangleWithGradient(
    x,
    y,
    width,
    height,
    color1 = "#000",
    color2 = "#444"
  ) {
    if (!this.canvasContext) {
      Log.error("Context not defined");
      return;
    }

    this.canvasContext.fillStyle = createGradient(color1, color2);
    this.canvasContext.fillRect(Math.round(x), Math.round(y), width, height);
  }

  /**
   * @param {string} imagePath Path to the image on `assets` folder
   * @param {number} x Position on the X axis
   * @param {number} y Position on the Y axis
   * @param {number} width Image's width
   * @param {number} height Image's height
   * @param {number} valueToExcludeYOnClear Some sprites have remaining pixels on Y sometimes, so we clear more space on Y to guarantee
   * @param {number} opacity Opacity of the image. Default is `1` (100%)
   * @returns {void}
   */
  drawImage(
    imagePath,
    x,
    y,
    width = 150,
    height = 150,
    valueToExcludeYOnClear = 0,
    opacity = 1
  ) {
    let image = new Image();
    image.src = imagePath;

    image.onload = () => {
      if (!this.canvasContext) {
        Log.error("Context not defined");
        return;
      }

      this.canvasContext.clearRect(
        Math.round(x),
        Math.round(y) + valueToExcludeYOnClear,
        width,
        height
      );

      this.canvasContext.globalAlpha = opacity;
      this.canvasContext.drawImage(
        image,
        Math.round(x),
        Math.round(y),
        width,
        height
      );
      this.canvasContext.globalAlpha = 1;
    };
    image.onerror = function (error) {
      console.log(error);
    };
  }

  /**
   * Get a random image from a given directory where the image's names are
   * defined with the pattern: 
   * 
   * @example 
   * XXXX.png -> 0000.png or 0001.png
   * 
   * @param {string} basePath
   * @param {number} numberOfImages
   * @param {string} imageFileExtension
   * @param {number} quantityOfNumbers
   * @returns {string}
   */
  getRandomImage(
    basePath,
    numberOfImages,
    imageFileExtension = ".png",
    quantityOfNumbers = 4
  ) {
    const value = Math.floor(Math.random() * numberOfImages);
    const allNumbers = value.toString().padStart(quantityOfNumbers, "0");

    return `${basePath}/${allNumbers}${imageFileExtension}`;
  }

  /**
   * Abstraction to the `clearRect` function from CanvasRenderingContext2D
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @returns {void}
   */
  clearRectUtil(x, y, width, height) {
    this.canvasContext.clearRect(Math.round(x), Math.round(y), width, height);
  }

  /**
   * Gets a random element on a list of elements.
   * 
   * If validateIfIsTheSame is `true` the function will be called recursively until
   * a different value from the previous is generated
   * @param {Array} elements
   * @param {Number} numberOfElements
   * @param {Boolean} validateIfIsTheSame
   * @param {String} contextKey
   * @returns {Object}
   */
  getRandomElement(
    elements,
    numberOfElements,
    validateIfIsTheSame = false,
    contextKey = ""
  ) {
    const randomIndex = Math.floor(numberOfElements * Math.random());
    const random = elements[randomIndex];

    if (!validateIfIsTheSame) return random;

    if (this.isTheSameValue(contextKey, randomIndex)) {
      return this.getRandomElement(
        elements,
        numberOfElements,
        true,
        contextKey
      );
    }

    return random;
  }

  /**
   * Verify if a new random value is the same in the `previousObject`
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
   * @param {string} color1 Color in hex
   * @param {string} color2 Color in hex
   * @returns {CanvasGradient}
   */
  createGradient(color1, color2) {
    const gradient = this.canvasContext.createLinearGradient(0, 0, 45, 0);

    gradient.addColorStop(1, color1);
    gradient.addColorStop(1, color2);

    return gradient;
  }
}
