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
    valueToExcludeYOnClear = 0
  ) {
    console.log(
      "Animação atual: ",
      componentBeingAnimated.currentAnimationFrame
    );
    if (!spritesTimes.hasOwnProperty(key)) {
      spritesTimes[key] = timeToAwait;
    }

    spritesTimes[key]--;

    // console.log('Sprite time: ', spritesTimes);

    if (componentBeingAnimated.currentAnimationFrame > animations.length - 1) {
      console.log("Terminou todas as animações");
      onAnimationEnds();

      componentBeingAnimated.currentAnimationFrame = 0;

      utility.clearRectUtil(
        componentBeingAnimated.x,
        componentBeingAnimated.y,
        componentBeingAnimated.width,
        componentBeingAnimated.height
      );

      delete spritesTimes[key];
      return;
    }

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
