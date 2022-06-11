import { Utility } from "../utils/index.js";
import { Log } from "../utils/log.js";
import player from "./player.js";

/** @type Utility */
let utility = null;
const baseWidth = 13;
const baseHeight = 130;

export default {
    maxVelocity: -5,
    /** @type {import('../types.js').Tile[]} */
    bullets: [],
    creationTime: 0,
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);
    },
    draw: function() {
        const length = this.bullets.length;

        for (let index = 0; index < length; index++) {
            const bullet = this.bullets[index];

            utility.drawImage(
                bullet.imageSource,
                bullet.x,
                bullet.y,
                bullet.width,
                bullet.height,
                10
            );
        }
    },
    create: function() {
        if (this.creationTime > 0) return;

        /** @type {import('../types.js').Tile} */
        const tile = {
            x: player.x + (player.width / 2.5),
            y: player.y - 70,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: 'assets/Damage/Fire.png',
            getBoxCollider() {
                return {
                    x: this.x,
                    y: this.y,
                    width: baseWidth,
                    height: baseHeight
                }
            }
        };

        this.bullets.push(tile);
        this.creationTime = 20 + Math.floor(31 * Math.random())
    },
    update: function() {
        Log.debug(`Bullets quantity ${this.bullets.length}`);

        this.creationTime--;

        this.bullets.forEach((bullet, index) => {
            if (!bullet.velocityInY) bullet.velocityInY = this.maxVelocity;
            if (!bullet.y) bullet.y = 0;

            bullet.y += bullet.velocityInY;

            if ((bullet.y + bullet.height) < 0) {
                utility.clearRectUtil(
                    bullet.x,
                    bullet.y,
                    bullet.width,
                    bullet.height
                );
                this.bullets.splice(index, 1);
                return;
            }
        });
    },
    reset() {
        this.bullets.forEach(bullet => {
            utility.clearRectUtil(bullet.x, bullet.y, bullet.width, bullet.height)
        });
        this.bullets = [];
    },
};