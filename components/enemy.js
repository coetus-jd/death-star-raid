/**
 * @typedef Enemy
 * @property {Tile[]} enemies
 * @property {Array[Position]} possiblesPositions
 * @property {Function} clear
 * @property {Function} draw
 * @property {Function} create
 * @property {Function} update
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawRectangle, getRandomElement } from "../utils/index.js";
import bullet from "./bullet.js";
import player from "./player.js";

/** @type Enemy */
export default {
    gravity: 1,
    enemies: [],
    possiblesPositions: [
        { x: GAME_SETTINGS.BASE_WIDTH / 2, y: GAME_SETTINGS.BASE_HEIGHT / 2  },
        { x: GAME_SETTINGS.BASE_WIDTH / 3,  y: GAME_SETTINGS.BASE_HEIGHT / 3 }
    ],
    clear: function () {
        this.bullets = [];
    },
    draw: function () {
        this.enemies.forEach((tile) => {
            drawRectangle(tile.x, tile.y, tile.width, tile.height, tile.color);
        });
    },
    create: function () {
        if (this.enemies.length > 2) return;
        
        /** @type Position */
        const randomPosition = getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );

        /** @type Tile */
        const enemy = {
            x: randomPosition.x,
            y: randomPosition.y,
            width: 6,
            height: 30,
            velocityInY: 0,
            color: 'red'
        };

        this.enemies.push(enemy);
    },
    update: function () {
        console.log(`The bullet is in Y: ${bullet.y}`);
        this.enemies.forEach((tile, index) => {
            tile.velocityInY += this.gravity;
            tile.y += tile.velocityInY;

            if ((tile.y - tile.height) < 0) {
                this.bullets.splice(index, 1);
                return;
            }
        });
    },
};