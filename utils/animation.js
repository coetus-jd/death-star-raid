import { Utility } from "./index.js";

/** @type Utility */
let utility = null;

/** Object that holds reference to animations by a given key */
const spritesTimes = {};

export default {
  /**
   * @param {CanvasRenderingContext2D} newContext
   */
  init: function (newContext) {
    utility = new Utility(newContext);
  },
  /**
   *
   * @param {string} key
   * @param {Number} timeToAwait
   * @param {import('../types').Tile} componentBeingAnimated
   * @param {string[]} animations
   * @param {Function} onAnimationEnds
   * @returns {void}
   */
  animate: function (
    key,
    timeToAwait,
    componentBeingAnimated,
    animations,
    onAnimationEnds = () => {},
    valueToExcludeYOnClear = -20
  ) {
    if (!spritesTimes.hasOwnProperty(key)) {
      spritesTimes[key] = timeToAwait;
    }

    spritesTimes[key]--;

    if (spritesTimes[key] > 0) return;

    if (componentBeingAnimated.currentAnimationFrame > animations.length - 1) {
      onAnimationEnds();

      utility.clearRectUtil(
        componentBeingAnimated.x,
        componentBeingAnimated.y,
        componentBeingAnimated.width,
        componentBeingAnimated.height
      );

      delete spritesTimes[key];
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
  animateContinuous: function (
    key,
    timeToAwait,
    componentBeingAnimated,
    animations,
    stopAnimation = false
  ) {
    if (!spritesTimes.hasOwnProperty(key)) {
      spritesTimes[key] = timeToAwait;
    }

    if (stopAnimation) {
      delete spritesTimes[key]
      return;
    }

    spritesTimes[key]--;

    if (spritesTimes[key] > 0) return;

    if (componentBeingAnimated.currentAnimationFrame > animations.length - 1) {
      componentBeingAnimated.currentAnimationFrame = 0;
    }

    utility.drawImage(
      animations[componentBeingAnimated.currentAnimationFrame],
      componentBeingAnimated.x,
      componentBeingAnimated.y,
      componentBeingAnimated.width,
      componentBeingAnimated.height,
    //   -20
    );

    componentBeingAnimated.currentAnimationFrame++;
    spritesTimes[key] = timeToAwait;
  },
};
