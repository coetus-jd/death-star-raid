/**
 * @typedef Bullet
 * @property {Tile[]} bullets
 * @property {Function} clear
 * @property {Function} draw
 * @property {Function} create
 * @property {Function} update
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawRectangle, drawImage } from "../utils/index.js";
import player from "./player.js";

/** @type Bullet */
export default {
    gravity: -0.1,
    bullets: [],
    clear: function () {
        this.bullets = [];
    },
    draw: function () {
        this.bullets.forEach((tile) => {
            drawImage(tile.imageSource, tile.x, tile.y, tile.width, tile.height);
        });
    },
    create: function () {
        /** @type Tile */
        const rightTile = {
            x: player.x - 4,
            y: player.y,
            width: 6,
            height: 30,
            velocityInY: 0,
            imageSource: 'assets/MockupClaro.png'
        };

        this.bullets.push(rightTile);
    },
    update: function () {
        this.bullets.forEach((tile, index) => {
            tile.velocityInY += this.gravity;
            tile.y += tile.velocityInY;

            if ((tile.y - tile.height) < 0) {
                this.bullets.splice(index, 1);
                return;
            }
        });
    },
};