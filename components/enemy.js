/**
 * @typedef Enemy
 * @property {Tile[]} enemies
 * @property {Position[]} possiblesPositions
 * @property {Function} clear
 * @property {Function} draw
 * @property {Function} create
 * @property {Function} update
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { Utility } from '../utils/index.js';

import bullet from "./bullet.js";
import player from "./player.js";
import types from '../types.js';
import GAME_STATES from "../constants/gameStates.js";

const baseWidth = 150;
const baseHeight = 150;
/** @type Utility */
let utility = null;

/** @type Enemy */
export default {
    gravity: GAME_SETTINGS.GRAVITY,
    maxVelocity: 3, //GAME_SETTINGS.MAX_VELOCITY,
    enemies: [],
    possiblesPositions: [{
            x: GAME_SETTINGS.LIMIT_IN_X.MIN,
            y: -baseHeight - 50
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth,
            y: -baseHeight - 25
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth * 2,
            y: -baseHeight - 10
        }
    ],
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);
    },
    clear: function() {
        this.enemies = [];
    },
    draw: function() {
        const length = this.enemies.length;

        for (let index = 0; index < length; index++) {
            const tile = this.enemies[index];

            utility.drawImage(
                tile.imageSource,
                tile.x,
                tile.y,
                tile.width,
                tile.height
            );
        }
    },
    create: function() {
        if (this.enemies.length !== 0) return;

        // Reset the velocity
        this.maxVelocity = 3;

        /** @type Position */
        const randomPosition1 = utility.getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );

        // debugger;

        /** @type Position */
        const randomPosition2 = utility.getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );


        /** @type Tile */
        const enemy1 = {
            x: randomPosition1.x,
            y: randomPosition1.y,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/Enemies/X-Wing',
                6
            )
        };

        const enemy2 = {
            x: randomPosition2.x,
            y: randomPosition2.y,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/Enemies/X-Wing',
                6
            )
        };

        this.enemies.push(enemy1, enemy2);
    },
    update: function() {
        console.debug(`Enemies quantity: ${this.enemies.length}`);

        this.enemies.forEach((enemy, index) => {
            if (enemy.y > 0) this.maxVelocity = -0.1;

            if (!enemy.velocityInY) enemy.velocityInY = this.maxVelocity;
            if (!enemy.y) enemy.y = 0;

            enemy.y += enemy.velocityInY;

            console.log(`Enemy ${index} position in Y: ${enemy.y} | X: ${enemy.x}`)

            if ((enemy.y - enemy.height) > GAME_SETTINGS.BASE_HEIGHT) {
                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                this.enemies.splice(index, 1);
                player.score++;
                return;
            }

            // player.x = 525
            // player.y = 750
            // player.width= 150
            // player.height = 150
            // tile.x = 525
            // tile.y = -172
            // tile.width= 150
            // tile.height = 150
            if (utility.hasCollided(player, enemy)) {
                console.debug(`Enemy ${index} collide with player`);
                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                this.enemies.splice(index, 1);
                return;
            }


            bullet.bullets.forEach((bulletTile, bulletIndex) => {
                if (!utility.hasCollided(bulletTile, enemy)) return;

                console.debug(`Bullet ${bulletIndex} collide with enemy`);

                utility.clearRectUtil(enemy.x, enemy.y, enemy.width, enemy.height);
                utility.clearRectUtil(bulletTile.x, bulletTile.y, bulletTile.width, bulletTile.height);

                this.enemies.splice(index, 1);
                bullet.bullets.splice(bulletIndex, 1);
            })

        });
    },
};