/**
 * @typedef Player
 * @property {Number} x Position in the X axis where the player will be created
 * @property {Number} y Position in the Y axis where the player will be created
 * @property {Number} height Height of the player
 * @property {Number} width Width of the player
 * @property {string} color Color of the player
 * @property {Number} gravity Gravity 
 * @property {Number} velocity Velocity of the movemnt of the player
 * @property {Number} score 
 * @property {function} update
 * @property {function} reset
 */

import floor from "./floor.js";

import GAME_SETTINGS from "../constants/gameSettings.js";

/** @type Player */
export default {
    x: 50,
    y: 0,
    height: 50,
    width: 50,
    color: "#47fd",
    gravity: 1.6,
    velocity: 0,
    score: 0,
    update: function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y > (floor.y - this.height)) {
            this.y = floor.y - this.height;
        }
    },
    reset: function () {
        this.velocity = 0;
        this.y = 0;

        if (this.score > GAME_SETTINGS.RECORD) {
            localStorage.setItem("record", this.score);
            GAME_SETTINGS.RECORD = this.score;
        }

        this.score = 0;
    },
};