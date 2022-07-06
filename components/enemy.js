import GAME_SETTINGS from "../constants/gameSettings.js";
import ENEMY_STATES from "../constants/enemyState.js";
import ENEMIES_TYPES from "../constants/enemiesTypes.js";

import gameController from "../controllers/gameController.js";
import scoreController from "../controllers/scoreController.js";

import { Utility } from "../utils/index.js";
import { Log } from "../utils/log.js";

import bullet from "./bullet.js";
import player from "./player.js";
import animation from "../utils/animation.js";

const baseWidth = 150;
const baseHeight = 150;
const baseLife = 2;

/** @type Utility */
let utility = null;

export default {
  gravity: GAME_SETTINGS.GRAVITY,
  maxVelocity: GAME_SETTINGS.MAX_VELOCITY - 1,
  /** @type {import('../types.js').Tile[]} */
  enemies: [],
  animationFrame: 0,
  /** All positions that a enemy can be instantiated */
  possiblesPositions: [
    {
      x: GAME_SETTINGS.LIMIT_IN_X.MIN,
      y: -baseHeight - 50,
    },
    {
      x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth,
      y: -baseHeight - 25,
    },
    {
      x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth * 2,
      y: -baseHeight - 10,
    },
  ],
  /**
   * @param {CanvasRenderingContext2D} newContext
   */
  init: function (newContext) {
    utility = new Utility(newContext);
    animation.init(newContext);
  },
  reset: function () {
    this.enemies.forEach((enemy) => {
      utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    this.enemies = [];
  },
  draw: function () {
    const length = this.enemies.length;

    for (let index = 0; index < length; index++) {
      const enemy = this.enemies[index];

      if (!enemy) continue;

      if (enemy.state === ENEMY_STATES.DEAD) {
        animateEnemyExplosion.call(this, enemy, index);
        continue;
      }

      if (enemy.state === ENEMY_STATES.DAMAGE) {
        enemy.type === ENEMIES_TYPES.X_WING
          ? animateXWingEnemyDamage.call(this, index)
          : animateYWingEnemyDamage.call(this, index);
        continue;
      }

      if (enemy.type === ENEMIES_TYPES.X_WING) {
        Log.debug(
          `Current enemy (X-Wing) animation frame: ${enemy.currentAnimationFrame}`
        );
        animateXWingEnemy(enemy);

        continue;
      }

      if (enemy.type === ENEMIES_TYPES.Y_WING) {
        Log.debug(
          `Current enemy (Y-Wing) animation frame: ${enemy.currentAnimationFrame}`
        );
        animateYWingEnemy(enemy);
      }
    }
  },
  create: function () {
    if (this.enemies.length !== 0) return;

    // Reset the velocity to the enemy "run"
    this.maxVelocity = 3;

    /** @type {import('../types.js').Position} */
    const randomPosition1 = utility.getRandomElement(
      this.possiblesPositions,
      this.possiblesPositions.length,
      true,
      "enemyPosition"
    );

    /** @type {import('../types.js').Position} */
    const randomPosition2 = utility.getRandomElement(
      this.possiblesPositions,
      this.possiblesPositions.length,
      true,
      "enemyPosition"
    );

    /** @type {import('../types.js').Tile} */
    const enemy1 = {
      x: randomPosition1.x,
      y: randomPosition1.y,
      width: baseWidth,
      height: baseHeight,
      velocityInY: 0,
      life: baseLife,
      type: ENEMIES_TYPES.X_WING,
      state: ENEMY_STATES.MOVING_FORWARD,
      currentAnimationFrame: 0,
      imageSource: utility.getRandomImage("assets/Enemies/X-Wing", 6),
      /**
       * @returns {import('../types.js').Collider}
       */
      getBoxCollider() {
        return {
          x: this.x + 30,
          y: this.y + 35,
          width: 90,
          height: 95,
        };
      },
    };

    /** @type {import('../types.js').Tile} */
    const enemy2 = {
      x: randomPosition2.x,
      y: randomPosition2.y,
      width: baseWidth,
      height: baseHeight,
      velocityInY: 0,
      state: ENEMY_STATES.MOVING_FORWARD,
      life: baseLife,
      type: ENEMIES_TYPES.Y_WING,
      currentAnimationFrame: 0,
      imageSource: utility.getRandomImage("assets/Enemies/Y-Wing", 4),
      /**
       * @returns {import('../types.js').Collider}
       */
      getBoxCollider() {
        return {
          x: this.x + 40,
          y: this.y + 5,
          width: 70,
          height: 135,
        };
      },
    };

    this.enemies.push(enemy1, enemy2);
  },
  update: function () {
    this.enemies.forEach((enemy, index) => {
      if (enemy.y > 0) this.maxVelocity = -1;

      if (!enemy.velocityInY) enemy.velocityInY = this.maxVelocity;
      if (!enemy.y) enemy.y = 0;

      enemy.y += enemy.velocityInY;

      if (enemy.state === ENEMY_STATES.DEAD) return;

      if (enemy.y - enemy.height > GAME_SETTINGS.BASE_HEIGHT) {
        scoreController.addPoint();
        removeEnemy.call(this, enemy, index);

        return;
      }

      if (utility.hasCollided(player, enemy)) {
        Log.debug(`Enemy ${index} collide with player`);

        removeEnemy.call(this, enemy, index);

        player.takeDamage();
        gameController.checkIfPlayerHasLost();

        return;
      }

      bullet.bullets.forEach((bulletTile, bulletIndex) => {
        if (!utility.hasCollided(bulletTile, enemy)) return;

        Log.debug(`Bullet ${bulletIndex} collide with enemy`);

        enemy.state = ENEMY_STATES.DAMAGE;
        enemy.life--;
        enemy.currentAnimationFrame = 0;

        if (enemy.life <= 0) {
          enemy.state = ENEMY_STATES.DEAD;
          utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        removeBullet(bulletTile, bulletIndex);
        scoreController.addPoint();
      });
    });
  },
};

function removeBullet(bulletTile, bulletIndex) {
  utility.clearRectUtil(
    bulletTile.x,
    bulletTile.y,
    bulletTile.width,
    bulletTile.height
  );
  bullet.bullets.splice(bulletIndex, 1);
}

function removeEnemy(enemy, index) {
  utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
  this.enemies.splice(index, 1);
}

const explosionAnimations = [
  "assets/Damage/Explosão/0000.png",
  "assets/Damage/Explosão/0001.png",
  "assets/Damage/Explosão/0002.png",
  "assets/Damage/Explosão/0003.png",
  "assets/Damage/Explosão/0004.png",
  "assets/Damage/Explosão/0005.png",
];

function animateEnemyExplosion(enemy, index) {
  animation.animate(
    "enemyExplosion",
    6,
    enemy,
    explosionAnimations,
    () => {
      removeEnemy.call(this, enemy, index);
    },
    -20
  );
}

const enemyYWingIdleAnimations = [
  "assets/Enemies/Y-Wing/0000.png",
  "assets/Enemies/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0002.png",
  "assets/Enemies/Y-Wing/0003.png",
];

function animateYWingEnemy(enemy) {
  animation.animate(
    "yWingEnemyIdle",
    10,
    enemy,
    enemyYWingIdleAnimations,
    () => {},
    -10
  );
}

const enemyXWingIdleAnimations = [
  "assets/Enemies/X-Wing/0000.png",
  "assets/Enemies/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0002.png",
  "assets/Enemies/X-Wing/0003.png",
  "assets/Enemies/X-Wing/0004.png",
  "assets/Enemies/X-Wing/0005.png",
];

function animateXWingEnemy(enemy) {
  animation.animate(
    "xWingEnemyIdle",
    10,
    enemy,
    enemyXWingIdleAnimations,
    () => {},
    -10
  );
}

const enemyXWingDamageAnimations = [
  "assets/Damage/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0000.png",
  "assets/Damage/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0000.png",
  "assets/Damage/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0000.png",
  "assets/Damage/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0000.png",
  "assets/Damage/X-Wing/0001.png",
  "assets/Enemies/X-Wing/0000.png",
];

function animateXWingEnemyDamage(index) {
  animation.animate(
    "xWingEnemyDamage",
    8,
    this.enemies[index],
    enemyXWingDamageAnimations,
    () => {
      this.enemies[index].state = ENEMY_STATES.MOVING_FORWARD;
    },
    -20
  );
}

const enemyYWingDamageAnimations = [
  "assets/Damage/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0000.png",
  "assets/Damage/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0000.png",
  "assets/Damage/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0000.png",
  "assets/Damage/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0000.png",
  "assets/Damage/Y-Wing/0001.png",
  "assets/Enemies/Y-Wing/0000.png",
];

function animateYWingEnemyDamage(index) {
  animation.animate(
    "yWingEnemyDamage",
    8,
    this.enemies[index],
    enemyYWingDamageAnimations,
    () => {
      this.enemies[index].state = ENEMY_STATES.MOVING_FORWARD;
    },
    -20
  );
}
