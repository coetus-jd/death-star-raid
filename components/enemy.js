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
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + (baseWidth / 2),
            y: -baseHeight
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MIN + baseWidth + (baseWidth / 2),
            y: -baseHeight
        },
        {
            x: GAME_SETTINGS.LIMIT_IN_X.MAX + baseWidth * 2 + (baseWidth / 2),
            y: -baseHeight
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
        if (this.enemies.length > 2) return;

        /** @type Position */
        const randomPosition = utility.getRandomElement(
            this.possiblesPositions,
            this.possiblesPositions.length,
            true,
            'enemyPosition'
        );

        /** @type Tile */
        const enemy = {
            x: randomPosition.x,
            y: randomPosition.y,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/Enemies/X-Wing',
                6
            )
        };

        this.enemies.push(enemy);
    },
    update: function() {
        const length = this.enemies.length;

        for (let index = 0; index < length; index++) {
            const tile = this.enemies[index];

            if (!tile.velocityInY) tile.velocityInY = this.maxVelocity;
            if (!tile.y) tile.y = 0;

            tile.y += tile.velocityInY;

            if ((tile.y - tile.height) > GAME_SETTINGS.BASE_HEIGHT) {
                this.enemies.splice(index, 1);
                return;
            }
        }
    },
};