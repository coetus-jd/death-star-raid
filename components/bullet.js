/**
 * @typedef Bullet
 * @property {Tile[]} bullets
 * @property {Function} clear
 * @property {Function} draw
 * @property {Function} create
 * @property {Function} update
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { Utility } from "../utils/index.js";
import player from "./player.js";
import types from "../types.js";

/** @type Utility */
let utility = null;
const baseWidth = 13;
const baseHeight = 130;

/** @type Bullet */
export default {
    gravity: -0.3,
    bullets: [],
    creationTime: 0,
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);
    },
    clear: function() {
        this.bullets = [];
    },
    draw: function() {
        this.bullets.forEach((tile) => {
            utility.drawImage(
                tile.imageSource,
                tile.x,
                tile.y,
                tile.width,
                tile.height
            );
        });
    },
    create: function() {
        if (this.creationTime > 0) return;

        /** @type Tile */
        const rightTile = {
            x: player.x,
            y: player.y - 90,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: 'assets/Damage/Fire.png'
        };

        this.bullets.push(rightTile);
        this.creationTime = 20 + Math.floor(31 * Math.random())
    },
    update: function() {
        this.creationTime--;
        console.debug(`Bullets quantity ${this.bullets.length}`);
        this.bullets.forEach((tile, index) => {
            tile.velocityInY += this.gravity;
            tile.y += tile.velocityInY;

            if ((tile.y + tile.height) < 0) {
                this.bullets.splice(index, 1);
                return;
            }
        });
    },
};