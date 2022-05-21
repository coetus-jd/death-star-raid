/**
 * @typedef Bullet
 * @property {Tile[]} bullets
 * @property {Function} clear
 * @property {Function} draw
 * @property {Function} create
 * @property {Function} update
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawRectangle } from "../utils/index.js";
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
            drawRectangle(tile.x, tile.y, tile.width, tile.height, tile.color);
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
            color: 'yellow'
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