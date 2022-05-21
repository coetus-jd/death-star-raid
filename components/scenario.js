/**
 * @typedef Scenario
 * @property {Number} gravity
 * @property {Tile[]} allScenarioObjects
 * @property {Function} clear
 * @property {Function} update
 * @property {Function} draw
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawRectangle } from "../utils/index.js";

/** @type Scenario */
export default {
    gravity: 0.1,
    allScenarioObjects: [],
    clear: function () {
        this.allScenarioObjects = [];
    },
    draw: function () {
        this.allScenarioObjects.forEach((tile) => {
            drawRectangle(tile.x, tile.y, tile.width, tile.height, "green");
        });
    },
    create: function () {
        if (!this.allScenarioObjects) return;

        const previousIndex =  this.allScenarioObjects.length - 1;

        const previousObject = this.allScenarioObjects[previousIndex];
        
        // Only create another tile if the previous was completed shown 
        if (previousObject && previousObject.y <= 0.5) return;

        /** @type Tile */
        const rightTile = {
            x: 0,
            y: 0,
            width: 200,
            height: 40,
            velocityInY: 0,
            imageSource: ''
        };

        /** @type Tile */
        const leftTile = {
            x: GAME_SETTINGS.BASE_WIDTH - 200,
            y: 0,
            width: 200,
            height: 40,
            velocityInY: 0,
            imageSource: ''
        };

        this.allScenarioObjects.push(rightTile);
        this.allScenarioObjects.push(leftTile);
    },
    update: function () {
        this.allScenarioObjects.forEach((tile, index) => {
            tile.velocityInY += this.gravity;
            tile.y += tile.velocityInY;

            if ((tile.y - tile.height) > GAME_SETTINGS.BASE_HEIGHT) {
                this.allScenarioObjects.splice(index, 1);
                return;
            }

            // if (
            //     player.x < (object.x + object.width)
            //     && (player.x + player.width) >= object.x
            //     && (player.y + player.height) >= (floor.y - object.height)
            // ) {
            //     GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.LOST;
            // }
            // else if (object.x === player.x) player.score++;
        });
    },
};