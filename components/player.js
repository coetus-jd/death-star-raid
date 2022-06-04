/**
 * @typedef Player
 * @property {Number} x Position in the X axis where the player will be created
 * @property {Number} y Position in the Y axis where the player will be created
 * @property {Number} height Height of the player
 * @property {Number} width Width of the player
 * @property {string} image Asset of the player
 * @property {Number} gravity Gravity 
 * @property {Number} velocity Velocity of the movement of the player
 * @property {Number} life
 * @property {function} draw
 * @property {function} update
 * @property {function} reset
 */

import floor from "./floor.js";

import GAME_SETTINGS from "../constants/gameSettings.js";
import GAME_STATES from "../constants/gameStates.js";
import { Utility } from "../utils/index.js";

const baseHeight = 150;
const baseWidth = 150;
/** @type Utility */
let utility = null;

/** @type Player */
export default {
    x: GAME_SETTINGS.BASE_WIDTH / 2 - (baseWidth / 2),
    y: floor.y - baseHeight,
    movementVelocity: 6,
    height: baseHeight,
    width: baseWidth,
    image: 'assets/TieFighter/0003 - Neutro.png',
    gravity: 1.6,
    velocity: 0,
    life: 5,
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);

        document.addEventListener("keypress", (event) => {
            if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
                this.movePlayer(1);
            }

            if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
                this.movePlayer(-1);
            }
        });
    },
    draw: function() {
        utility.drawImage(
            this.image,
            this.x,
            this.y,
            this.width,
            this.height
        );
    },
    update: function() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y > (floor.y - this.height)) {
            this.y = floor.y - this.height;
        }
    },
    reset: function() {
        this.velocity = 0;
        this.life = 5;
        this.x = GAME_SETTINGS.BASE_WIDTH / 2 - (baseWidth / 2);

        if (GAME_SETTINGS.RECORD > GAME_SETTINGS.BEST_RECORD) {
            localStorage.setItem("record", GAME_SETTINGS.RECORD);
            GAME_SETTINGS.RECORD = this.score;
        }

        if (utility)
            utility.clearRectUtil(
                this.x,
                this.y,
                this.width,
                this.height,
            );
        GAME_SETTINGS.RECORD = 0;
    },
    movePlayer(direction = 0) {
        if (!direction) return;
        if (GAME_SETTINGS.CURRENT_GAME_STATE !== GAME_STATES.PLAYING) return;

        const newXPosition = this.movementVelocity * direction;

        if (
            direction === 1 &&
            (this.x + (baseWidth / 1.2)) >= GAME_SETTINGS.LIMIT_IN_X.MAX
        )
            return;

        if (
            direction === -1 &&
            (this.x + (baseWidth / 5)) <= GAME_SETTINGS.LIMIT_IN_X.MIN
        )
            return;


        this.x += newXPosition;
    },
    getBoxCollider() {
        return {
            x: this.x + 30,
            y: this.y + 30,
            width: 90,
            height: 80
        }
    },
};