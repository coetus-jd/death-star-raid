/**
 * @typedef Scenario
 * @property {Number} gravity
 * @property {Tile[]} allScenarioObjects
 * @property {Tile[]} tilesToDraw
 * @property {Tile[]} initialTilesPositions
 * @property {Function} clear
 * @property {Function} create
 * @property {Function} update
 * @property {Function} draw
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawImage, drawRectangle, getRandomImage } from "../utils/index.js";

const baseWidth = 150;
const baseHeight = 150;

/** @type Scenario */
export default {
    gravity: 0.01,
    allScenarioObjects: [],
    tilesCreationPositions: [{
            x: 0,
            y: 0,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
        },
        {
            x: baseWidth,
            y: 0,
            width: baseWidth + baseWidth,
            height: baseHeight,
            velocityInY: 0,
        },
        {
            x: GAME_SETTINGS.BASE_WIDTH - baseWidth,
            y: 0,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
        },
        {
            x: GAME_SETTINGS.BASE_WIDTH - (baseWidth * 2),
            y: 0,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
        }
    ],
    clear: function() {
        this.allScenarioObjects = [];
    },
    draw: function() {
        this.allScenarioObjects.forEach((tile) => {
            drawImage(tile.imageSource, tile.x, tile.y, tile.width, tile.height);
        });
    },
    /**
     * Create initial elements in scenario
     */
    createBasicElements() {
        const allScenarioBasicTiles = [
            ...generateRightInitialTilesPositions(),
            ...generateLeftInitialTilesPositions(),
            ...generateMiddleInitialTilesPositions()
        ];

        allScenarioBasicTiles.forEach(tile => {
            drawImage(tile.imageSource, tile.x, tile.y, tile.width, tile.height);
        });
    },
    create: function() {
        const previousIndex = this.allScenarioObjects.length - 1;

        /** @type Tile */
        const previousObject = this.allScenarioObjects[previousIndex];

        // Only create another tile if the previous was completed shown 
        // if (previousObject && previousObject.y <= baseHeight) return;

        this.tilesCreationPositions.forEach((tilePosition) => {
            tilePosition.imageSource = 'assets/DeathStarTiles/1 - Laterais/0000.png';
            this.allScenarioObjects.push(tilePosition);
        });
    },
    update: function() {
        console.log('Tiles qtd: ' + this.allScenarioObjects.length);
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

/**
 * @returns Tile[]
 */
function generateLeftInitialTilesPositions() {
    const rows = 6;
    /** Tile[] */
    const array = [];

    for (let index = 0; index < rows; index++) {
        array.push({
            x: 0,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        });

        array.push({
            x: baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        })
    }

    return array;
}

/**
 * @returns Tile[]
 */
function generateRightInitialTilesPositions() {
    const rows = 6;
    /** Tile[] */
    const array = [];

    for (let index = 0; index < rows; index++) {
        array.push({
            x: GAME_SETTINGS.BASE_WIDTH - baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        });

        array.push({
            x: GAME_SETTINGS.BASE_WIDTH - (baseWidth * 2),
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        })
    }

    return array;
}

/**
 * @returns Tile[]
 */
function generateMiddleInitialTilesPositions() {
    const rows = 6;
    /** Tile[] */
    const array = [];
    const baseX = baseWidth * 2;

    for (let index = 0; index < rows; index++) {
        array.push({
            x: baseX,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        });

        array.push({
            x: baseX + baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        });

        array.push({
            x: baseX + (baseWidth * 2),
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        })
    }

    return array;
}