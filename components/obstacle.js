/**
 * @typedef Obstacle
 * @property {Obstacle[]} allObstacles
 * @property {string[]} colors
 * @property {Number[]} positions
 * @property {Number} insertTime
 * @property {function} clear
 * @property {function} update
 * @property {function} draw
 */

import { getRandomElement, drawRectangle } from "../utils/index.js";

import GAME_SETTINGS from "../constants/gameSettings.js";
import GAME_STATE from "../constants/gameStates.js";

import floor from "./floor.js";
import player from "./player.js";

/** @type Obstacle */
export default {
    allObstacles: [],
    colors: ["#3beca8", "#fcc147", "#6c2d4e", "#def098", "#cd382f"],
    positions: [GAME_SETTINGS.BASE_WIDTH / 2, GAME_SETTINGS.BASE_WIDTH / 3, GAME_SETTINGS.BASE_WIDTH / 1.2, GAME_SETTINGS.BASE_WIDTH / 1.4, GAME_SETTINGS.BASE_WIDTH / 1.6],
    insertTime: 0,
    clear: function () {
        this.allObstacles = [];
    },
    create: function () {
        this.allObstacles.push({
            x: GAME_SETTINGS.BASE_WIDTH, // getRandomElement(this.positions, 5, true, 'obstaclePositions'),
            y: 0,
            width: 20 + Math.floor(20 * Math.random()),
            height: 30 + Math.floor(120 * Math.random()),
            color: getRandomElement(this.colors, 5, true, 'obstacleColors'),
            gravity: 1.6,
            velocityInY: 0,
            velocityInX: 3,
        });

        this.insertTime = 50 + Math.floor(31 * Math.random());
    },
    update: function () {
        if (this.insertTime === 0) this.create();
        else this.insertTime--;

        this.allObstacles.forEach((obstacle, index) => {
            obstacle.velocityInY += obstacle.gravity;
            obstacle.y += obstacle.velocityInY;

            if (obstacle.y > (floor.y - obstacle.height)) {
                obstacle.y = floor.y - obstacle.height;
            }

            obstacle.x -= obstacle.velocityInX;

            if (obstacle.x <= -obstacle.width) {
                this.allObstacles.splice(index, 1);
                return;
            }

            if (
                player.x < (obstacle.x + obstacle.width)
                && (player.x + player.width) >= obstacle.x
                && (player.y + player.height) >= (floor.y - obstacle.height)
            ) {
                GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.LOST;
            }
            else if (obstacle.x === player.x) player.score++;
        });
    },
    draw: function () {
        this.allObstacles.forEach((obstacle) => {
            drawRectangle(
                obstacle.x,
                obstacle.y, // floor.y - obstacle.height,
                obstacle.width,
                obstacle.height,
                obstacle.color
            );
        });
    },
};