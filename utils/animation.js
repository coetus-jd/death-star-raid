import { Utility } from "./index.js";

/** @type Utility */
let utility = null;

/** Object that holds reference to animations by a given key */
const spritesTimes = {};

/**
 * Basic class to animate a serie of images on canvas
 */
export default {
  /**
   * @param {CanvasRenderingContext2D} newContext
   */
  init: function (newContext) {
    utility = new Utility(newContext);
  },
  /**
   * Animate a sequence of images on the canvas
   * @param {string} key A key to control which animation is playing
   * @param {Number} timeToAwait How much will be waited to execute the another animation frame
   * @param {import('../types').Tile} componentBeingAnimated
   * @param {string[]} animations Paths to the images that will compound the animation
   * @param {Function} onAnimationEnds A function that will executed when the animations ends
   * @param {number} valueToExcludeYOnClear Workaround to resolve the problem of clearRect on drawImage function
   * @returns {void}
   */
  animate: function (
    key,
    timeToAwait,
    componentBeingAnimated,
    animations,
    onAnimationEnds = () => {},
    valueToExcludeYOnClear = 0
  ) {
    if (!spritesTimes.hasOwnProperty(key)) {
      spritesTimes[key] = timeToAwait;
    }

    if (componentBeingAnimated.currentAnimationFrame > animations.length - 1) {
      onAnimationEnds();

      componentBeingAnimated.currentAnimationFrame = 0;

      delete spritesTimes[key];
      return;
    }

    spritesTimes[key]--;

    if (spritesTimes[key] > 0) {
      utility.drawImage(
        animations[componentBeingAnimated.currentAnimationFrame],
        componentBeingAnimated.x,
        componentBeingAnimated.y,
        componentBeingAnimated.width,
        componentBeingAnimated.height,
        valueToExcludeYOnClear
      );
      return;
    }

    utility.drawImage(
      animations[componentBeingAnimated.currentAnimationFrame],
      componentBeingAnimated.x,
      componentBeingAnimated.y,
      componentBeingAnimated.width,
      componentBeingAnimated.height,
      valueToExcludeYOnClear
    );

    componentBeingAnimated.currentAnimationFrame++;
    spritesTimes[key] = timeToAwait;
  },
};
