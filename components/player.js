import GAME_SETTINGS from "../constants/gameSettings.js";
import GAME_STATES from "../constants/gameStates.js";
import PLAYER_STATES from "../constants/playerState.js";

import floor from "./floor.js";
import { Utility } from "../utils/index.js";

/** @type Utility */
let utility = null;
const baseHeight = 150;
const baseWidth = 150;
const rightAnimations = [
    'assets/TieFighter/0004 - DireitaLeve.png',
    'assets/TieFighter/0005 - Direita.png'
];

const leftAnimations = [
    'assets/TieFighter/0002 - EsquerdaLeve.png',
    'assets/TieFighter/0001 - Esquerda.png',
];

export default {
    /** Position in the X axis where the player will be created */
    x: GAME_SETTINGS.BASE_WIDTH / 2 - (baseWidth / 2),
    /** Position in the Y axis where the player will be created */
    y: floor.y - baseHeight,
    movementVelocity: 6,
    height: baseHeight,
    width: baseWidth,
    image: 'assets/TieFighter/0003 - Neutro.png',
    gravity: 1.6,
    /** Velocity of the movement of the player */
    velocity: 0,
    life: 5,
    state: PLAYER_STATES.IDLE,
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function (newContext) {
        utility = new Utility(newContext);

        document.addEventListener("keypress", (event) => {
            if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
                this.movePlayer(1);
            }

            if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
                this.movePlayer(-1);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "d" ||
                event.key === "D" ||
                event.keyCode === 68 ||
                event.key === "a" ||
                event.key === "A" ||
                event.keyCode === 65
            ) {
                this.movePlayer(0);
            }
        });
    },
    draw: function () {
        if (this.state === PLAYER_STATES.IDLE) {
            utility.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );
            return;
        }

        if (this.state === PLAYER_STATES.RIGHT) {
            utility.drawImage(
                rightAnimations[1],
                this.x,
                this.y,
                this.width,
                this.height
            );
            return;
            // this.animatePlayerToRight();
        }

        if (this.state === PLAYER_STATES.LEFT) {
            utility.drawImage(
                leftAnimations[1],
                this.x,
                this.y,
                this.width,
                this.height
            );
            return;
            // this.animatePlayerToRight();
        }
    },
    reset: function () {
        this.velocity = 0;
        this.life = 5;
        this.x = GAME_SETTINGS.BASE_WIDTH / 2 - (baseWidth / 2);

        // if (GAME_SETTINGS.RECORD > GAME_SETTINGS.BEST_RECORD) {
        //     localStorage.setItem("record", GAME_SETTINGS.RECORD);
        //     GAME_SETTINGS.RECORD = this.score;
        // }

        if (utility)
            utility.clearRectUtil(
                this.x,
                this.y,
                this.width,
                this.height,
            );
        GAME_SETTINGS.RECORD = 0;
    },
    /**
     * @param {Number} direction
     * @returns 
     */
    movePlayer(direction = 0) {
        if (!direction) {
            this.state = PLAYER_STATES.IDLE;
            return;
        }
        if (GAME_SETTINGS.CURRENT_GAME_STATE !== GAME_STATES.PLAYING) return;

        const newXPosition = this.movementVelocity * direction;

        if (
            direction === 1 &&
            (this.x + (baseWidth / 1.2)) >= GAME_SETTINGS.LIMIT_IN_X.MAX
        ) {
            this.state = PLAYER_STATES.IDLE;
            return;
        }

        if (
            direction === -1 &&
            (this.x + (baseWidth / 5)) <= GAME_SETTINGS.LIMIT_IN_X.MIN
        ) {
            this.state = PLAYER_STATES.IDLE;
            return;
        }

        this.state = direction === 1
            ? PLAYER_STATES.RIGHT
            : PLAYER_STATES.LEFT;

        this.x += newXPosition;
    },
    /** @type {import('../types.js').Collider} */
    getBoxCollider() {
        return {
            x: this.x + 30,
            y: this.y + 30,
            width: 90,
            height: 80
        }
    },
    takeDamage(damage = 1) {
        this.life -= damage;
        this.state = PLAYER_STATES.DAMAGE;
    },
    animatePlayerToRight: function () {
        const self = this;

        rightAnimations.forEach(function (animation) {
            utility.drawImage(
                animation,
                self.x,
                self.y,
                self.width,
                self.height
            );

            setTimeout(() => { }, 1000);
        });
    }
};

