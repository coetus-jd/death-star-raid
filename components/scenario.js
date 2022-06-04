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
import { Utility } from "../utils/index.js";
import types from '../types.js';

const baseWidth = 150;
const baseHeight = 150;
const baseRows = 6;
/** @type Utility */
let utility = null;

/** @type Scenario */
export default {
    gravity: GAME_SETTINGS.GRAVITY,
    maxVelocity: GAME_SETTINGS.MAX_VELOCITY,
    allScenarioObjects: [],
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function(newContext) {
        utility = new Utility(newContext);
    },
    clear: function() {
        this.allScenarioObjects = [];
    },
    draw: function() {
        const length = this.allScenarioObjects.length;

        for (let index = 0; index < length; index++) {
            const tile = this.allScenarioObjects[index];
            utility.drawImage(
                tile.imageSource,
                tile.x,
                tile.y,
                tile.width,
                tile.height
            );
        }
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
            utility.drawImage(tile.imageSource, tile.x, tile.y, tile.width, tile.height);
        });

        this.allScenarioObjects.push(...allScenarioBasicTiles);
    },
    create: function() {
        /** @type Tile */
        const firstTile = this.allScenarioObjects.find(x => x.firstTile);

        // Only create another tile if the previous was completed shown 
        if (!firstTile || firstTile.y < 1) return;

        const firstTileIndex = this.allScenarioObjects.indexOf(firstTile);

        this.allScenarioObjects[firstTileIndex].firstTile = false;

        const length = tilesCreationPositions.length;

        for (let index = 0; index < length; index++) {
            const tilePosition = tilesCreationPositions[index];

            const imagesPath = tilePosition.isInMiddle ?
                'assets/DeathStarTiles/2 - Fosso' :
                'assets/DeathStarTiles/1 - Laterais';

            tilePosition.imageSource = utility.getRandomImage(
                imagesPath,
                20
            );
            tilePosition.velocityInY = this.maxVelocity;
            this.allScenarioObjects.push({...tilePosition });
        }

        const lastIndex = this.allScenarioObjects.length - 1;
        this.allScenarioObjects[lastIndex].firstTile = true;
    },
    update: function() {
        console.debug(`Tiles quantity: ${this.allScenarioObjects.length}`);

        this.allScenarioObjects.forEach((tile, index) => {
            if (!tile.velocityInY) tile.velocityInY = this.maxVelocity;
            if (!tile.y) tile.y = 0;

            // if (tile.velocityInY < this.maxVelocity) tile.velocityInY += this.gravity;
            tile.y += tile.velocityInY;

            if ((tile.y - tile.height) > GAME_SETTINGS.BASE_HEIGHT) {
                utility.clearRectUtil(tile.x, tile.y, tile.width, tile.height);
                this.allScenarioObjects.splice(index, 1);
                return;
            }
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
            imageSource: utility.getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            ),
        }, {
            x: baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
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
            imageSource: utility.getRandomImage(
                'assets/DeathStarTiles/1 - Laterais',
                20
            )
        }, {
            x: GAME_SETTINGS.BASE_WIDTH - (baseWidth * 2),
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
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
            imageSource: utility.getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        }, {
            x: baseX + baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                'assets/DeathStarTiles/2 - Fosso',
                20
            )
        }, {
            x: baseX + (baseWidth * 2),
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
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