/**
 * @typedef Scenario
 * @property {Number} gravity
 * @property {Tile[]} allScenarioObjects
 * @property {Tile[]} initialTilesPositions
 * @property {Function} clear
 * @property {Function} create
 * @property {Function} update
 * @property {Function} draw
 */

import GAME_SETTINGS from "../constants/gameSettings.js";
import { drawImage, drawRectangle, getRandomImage } from "../utils/index.js";
import types from '../types.js';

const baseWidth = 150;
const baseHeight = 150;
const baseRows = 6;
let sharedVelocity = 0;

/** @type Scenario */
export default {
    gravity: 0.01,
    maxVelocity: 3,
    allScenarioObjects: [],
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

        allScenarioBasicTiles[0].firstTile = true;

        allScenarioBasicTiles.forEach(tile => {
            drawImage(tile.imageSource, tile.x, tile.y, tile.width, tile.height);
        });

        this.allScenarioObjects.push(...allScenarioBasicTiles);
    },
    create: function() {
        /** @type Tile */
        const firstTile = this.allScenarioObjects.find(x => x.firstTile);

        // Only create another tile if the previous was completed shown 
        if (!firstTile || firstTile.y < 1) return;

        const index = this.allScenarioObjects.indexOf(firstTile);

        this.allScenarioObjects[index].firstTile = false;

        tilesCreationPositions.forEach((tilePosition) => {
            const imagesPath = tilePosition.isInMiddle ?
                'assets/DeathStarTiles/2 - Fosso' :
                'assets/DeathStarTiles/1 - Laterais';

            tilePosition.imageSource = getRandomImage(
                imagesPath,
                20
            );
            tilePosition.velocityInY = this.sharedVelocity;
            this.allScenarioObjects.push({...tilePosition });
        });

        const lastIndex = this.allScenarioObjects.length - 1;
        this.allScenarioObjects[lastIndex].firstTile = true;
    },
    update: function() {
        console.debug(`Tiles quantity: ${this.allScenarioObjects.length}`)
        this.allScenarioObjects.forEach((tile, index) => {
            if (!tile.velocityInY) tile.velocityInY = this.maxVelocity;
            if (!tile.y) tile.y = 0;

            // if (tile.velocityInY < this.maxVelocity) tile.velocityInY += this.gravity;
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
    /** @type Tile[] */
    const array = [];

    for (let index = 0; index < baseRows; index++) {
        array.push({
            x: 0,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            ),
        }, {
            x: baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        });
    }

    return array;
}

/**
 * @returns Tile[]
 */
function generateRightInitialTilesPositions() {
    /** Tile[] */
    const array = [];

    for (let index = 0; index < baseRows; index++) {
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
        }, {
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
    /** Tile[] */
    const array = [];
    const baseX = baseWidth * 2;

    for (let index = 0; index < baseRows; index++) {
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
        }, {
            x: baseX + baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        }, {
            x: baseX + (baseWidth * 2),
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        });
    }

    return array;
}

/** @type Tile[] */
const tilesCreationPositions = [{
        x: 0,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
    },
    {
        x: baseWidth,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
    },
    {
        x: baseWidth * 2,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
        isInMiddle: true,
    },
    {
        x: baseWidth * 3,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
        isInMiddle: true,
    },
    {
        x: baseWidth * 4,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
        isInMiddle: true,
    },
    {
        x: baseWidth * 5,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
    },
    {
        x: baseWidth * 6,
        y: -baseHeight,
        width: baseWidth,
        height: baseHeight,
        velocityInY: 0,
    },
]