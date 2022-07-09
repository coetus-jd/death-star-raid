import GAME_SETTINGS from "../constants/gameSettings.js";
import GAME_STATES from "../constants/gameStates.js";
import PLAYER_STATES from "../constants/playerState.js";
import MOVEMENT_DIRECTIONS from "../constants/movementDirections.js";

import { Utility } from "../utils/index.js";
import animation from "../utils/animation.js";
import gameController from "../controllers/gameController.js";

const basePlayerHeight = 150;
const basePlayerWidth = 150;
const lifeBar = document.getElementById("life");

const rightAnimations = [
  "assets/TieFighter/0004 - DireitaLeve.png",
  "assets/TieFighter/0005 - Direita.png",
];

const leftAnimations = [
  "assets/TieFighter/0002 - EsquerdaLeve.png",
  "assets/TieFighter/0001 - Esquerda.png",
];

/** @type Utility */
let utility = null;

/**
 * Player settings and behaviors
 */
export default {
  /** Position in the X axis where the player will be created */
  x: GAME_SETTINGS.BASE_WIDTH / 2 - basePlayerWidth / 2,
  /** Position in the Y axis where the player will be created */
  y: GAME_SETTINGS.BASE_HEIGHT - basePlayerHeight,
  movementVelocity: 6,
  height: basePlayerHeight,
  width: basePlayerWidth,
  image: "assets/TieFighter/0003 - Neutro.png",
  gravity: 1.6,
  /** Velocity of movement of the player */
  velocity: 0,
  life: 3,
  currentAnimationFrame: 0,
  /** Enum from {@link playerState.js} */
  state: PLAYER_STATES.IDLE,
  /**
   * @param {CanvasRenderingContext2D} newContext
   */
  init: function (newContext) {
    utility = new Utility(newContext);
    animation.init(newContext);

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "d" ||
        event.key === "D" ||
        event.keyCode === 68 ||
        event.key === "ArrowRight" ||
        event.keyCode === 39
      ) {
        this.movePlayer(MOVEMENT_DIRECTIONS.RIGHT);
        return;
      }

      if (
        event.key === "a" ||
        event.key === "A" ||
        event.keyCode === 65 ||
        event.key === "ArrowLeft" ||
        event.keyCode === 37
      ) {
        this.movePlayer(MOVEMENT_DIRECTIONS.LEFT);
        return;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (
        event.key === "d" ||
        event.key === "D" ||
        event.keyCode === 68 ||
        event.key === "ArrowRight" ||
        event.keyCode === 39 ||
        event.key === "a" ||
        event.key === "A" ||
        event.keyCode === 65 ||
        event.key === "ArrowLeft" ||
        event.keyCode === 37
      ) {
        this.movePlayer(MOVEMENT_DIRECTIONS.IDLE);
      }
    });
  },
  draw: function () {
    if (this.state === PLAYER_STATES.DEAD) {
      animatePlayerExplosion.call(this);
      return;
    }

    if (this.state === PLAYER_STATES.DAMAGE) {
      animatePlayerDamage.call(this);
      return;
    }

    if (this.state === PLAYER_STATES.IDLE) {
      utility.drawImage(this.image, this.x, this.y, this.width, this.height);
      return;
    }

    if (this.state === PLAYER_STATES.FINISHED_MOVING_RIGHT) {
      utility.drawImage(
        rightAnimations[1],
        this.x,
        this.y,
        this.width,
        this.height
      );
      return;
    }

    if (this.state === PLAYER_STATES.MOVING_RIGHT) {
      animatePlayerRight.call(this);
      return;
    }

    if (this.state === PLAYER_STATES.FINISHED_MOVING_LEFT) {
      utility.drawImage(
        leftAnimations[1],
        this.x,
        this.y,
        this.width,
        this.height
      );
      return;
    }

    if (this.state === PLAYER_STATES.MOVING_LEFT) {
      animatePlayerLeft.call(this);
      return;
    }
  },
  reset: function () {
    this.velocity = 0;
    this.life = 3;
    this.x = GAME_SETTINGS.BASE_WIDTH / 2 - basePlayerWidth / 2;
    this.state = PLAYER_STATES.IDLE;

    lifeBar.style.backgroundImage =
      "url('assets/UX/TelaDeJogo/BarraDeVida/Full.png')";

    if (utility) utility.clearRectUtil(this.x, this.y, this.width, this.height);

    GAME_SETTINGS.RECORD = 0;
  },
  /**
   * @param {Number} direction
   * @returns {void}
   */
  movePlayer(direction = MOVEMENT_DIRECTIONS.IDLE) {
    if (direction === MOVEMENT_DIRECTIONS.IDLE) {
      this.state = PLAYER_STATES.IDLE;
      return;
    }

    if (GAME_SETTINGS.CURRENT_GAME_STATE !== GAME_STATES.PLAYING) return;

    const newXPosition = this.movementVelocity * direction;

    if (
      direction === MOVEMENT_DIRECTIONS.RIGHT &&
      this.x + basePlayerWidth / 1.2 >= GAME_SETTINGS.LIMIT_IN_X.MAX
    ) {
      this.state = PLAYER_STATES.IDLE;
      return;
    }

    if (
      direction === MOVEMENT_DIRECTIONS.LEFT &&
      this.x + basePlayerWidth / 5 <= GAME_SETTINGS.LIMIT_IN_X.MIN
    ) {
      this.state = PLAYER_STATES.IDLE;
      return;
    }

    const finishedRightOrLeftMovement = [
      PLAYER_STATES.FINISHED_MOVING_LEFT,
      PLAYER_STATES.FINISHED_MOVING_RIGHT,
    ].includes(this.state);

    if (!finishedRightOrLeftMovement) {
      const newPlayerStateBasedOnDirection =
        direction === MOVEMENT_DIRECTIONS.RIGHT
          ? PLAYER_STATES.MOVING_RIGHT
          : PLAYER_STATES.MOVING_LEFT;

      this.state = newPlayerStateBasedOnDirection;
    }

    this.x += newXPosition;
  },
  /** @type {import('../types.js').Collider} */
  getBoxCollider() {
    return {
      x: this.x + 30,
      y: this.y + 30,
      width: 90,
      height: 80,
    };
  },
  /**
   * Make the player take damage and lost life
   * @param {number} damage Quantity of damage that the player will take. Default is `1`
   */
  takeDamage(damage = 1) {
    this.life -= damage;

    const spritesToShowByLife = {
      [2]: 'assets/UX/TelaDeJogo/BarraDeVida/2lifes.png',
      [1]: 'assets/UX/TelaDeJogo/BarraDeVida/1life.png',
      [0]: 'assets/UX/TelaDeJogo/BarraDeVida/Dead.png',
      [null]: 'assets/UX/TelaDeJogo/BarraDeVida/Dead.png',
    };

    lifeBar.style.backgroundImage = `url(${spritesToShowByLife[this.life]})`;
    this.state = PLAYER_STATES.DAMAGE;
  },
};

const explosionAnimations = [
  "assets/Damage/Explosão/0000.png",
  "assets/Damage/Explosão/0001.png",
  "assets/Damage/Explosão/0002.png",
  "assets/Damage/Explosão/0003.png",
  "assets/Damage/Explosão/0004.png",
  "assets/Damage/Explosão/0005.png",
];

/**
 * Play player's explosion animation
 * @returns {void}
 */
function animatePlayerExplosion() {
  animation.animate("playerExplosion", 6, this, explosionAnimations, () => {
    gameController.lostGame();
  });
}

const damageAnimations = [
  "assets/Damage/Tie Fighter/Dano/0003 - NeutroDANO.png",
  "assets/TieFighter/0003 - Neutro.png",
  "assets/Damage/Tie Fighter/Dano/0003 - NeutroDANO.png",
  "assets/TieFighter/0003 - Neutro.png",
  "assets/Damage/Tie Fighter/Dano/0003 - NeutroDANO.png",
  "assets/TieFighter/0003 - Neutro.png",
  "assets/Damage/Tie Fighter/Dano/0003 - NeutroDANO.png",
  "assets/TieFighter/0003 - Neutro.png",
  "assets/Damage/Tie Fighter/Dano/0003 - NeutroDANO.png",
  "assets/TieFighter/0003 - Neutro.png",
];

/**
 * Play player's damage animation
 * @returns {void}
 */
function animatePlayerDamage() {
  animation.animate("playerDamage", 10, this, damageAnimations, () => {
    this.state = PLAYER_STATES.IDLE;
  });
}

/**
 * Play player's right animation
 * @returns {void}
 */
function animatePlayerRight() {
  animation.animate("playerRight", 20, this, rightAnimations, () => {
    this.state = PLAYER_STATES.FINISHED_MOVING_RIGHT;
  });
}

/**
 * Play player's left animation
 * @returns {void}
 */
function animatePlayerLeft() {
  animation.animate("playerLeft", 20, this, leftAnimations, () => {
    this.state = PLAYER_STATES.FINISHED_MOVING_LEFT;
  });
}
