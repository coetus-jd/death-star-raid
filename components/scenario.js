import GAME_SETTINGS from "../constants/gameSettings.js";
import { Utility } from "../utils/index.js";
import { Log } from "../utils/log.js";

const baseWidth = 300;
const baseHeight = 900;
const baseWidthMiddle = 450;
const baseRows = 1;

const baseMoatImages = {
    path: "assets/BlockedTiles/Fosso",
    quantity: 6
};
const baseSidesImages = {
    path: "assets/BlockedTiles/Laterais",
    quantity: 10
};

/** @type Utility */
let utility = null;

export default {
    gravity: GAME_SETTINGS.GRAVITY,
    maxVelocity: GAME_SETTINGS.MAX_VELOCITY,
    /** @type {import('../types.js').Tile[]} */
    allScenarioObjects: [],
    /**
     * @param {CanvasRenderingContext2D} newContext 
     */
    init: function (newContext) {
        utility = new Utility(newContext);
    },
    clear: function () {
        this.allScenarioObjects = [];
    },
    draw: function () {
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
    createBasicElements: function () {
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
    create: function () {
        /** @type Tile */
        const firstTile = this.allScenarioObjects.find(x => x.firstTile);

        // Only create another tile if the previous was completed shown 
        if (!firstTile || firstTile.y < 1) return;

        const firstTileIndex = this.allScenarioObjects.indexOf(firstTile);

        this.allScenarioObjects[firstTileIndex].firstTile = false;

        const length = tilesCreationPositions.length;

        for (let index = 0; index < length; index++) {
            const tilePosition = tilesCreationPositions[index];

            const imagesSettings = tilePosition.isInMiddle ?
                baseMoatImages:
                baseSidesImages;

            tilePosition.imageSource = utility.getRandomImage(
                imagesSettings.path,
                imagesSettings.quantity
            );
            tilePosition.velocityInY = this.maxVelocity;
            this.allScenarioObjects.push({ ...tilePosition });
        }

        const lastIndex = this.allScenarioObjects.length - 1;
        this.allScenarioObjects[lastIndex].firstTile = true;
    },
    update: function () {
        Log.debug(`Tiles quantity: ${this.allScenarioObjects.length}`);

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
 * @returns {import('../types.js').Tile[]}
 */
function generateLeftInitialTilesPositions() {
    const array = [];

    for (let index = 0; index < baseRows; index++) {
        array.push({
            x: 0,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                baseSidesImages.path,
                baseSidesImages.quantity
            ),
        });
    }

    return array;
}

/**
 * @returns {import('../types.js').Tile[]}
 */
function generateRightInitialTilesPositions() {
    const array = [];

    for (let index = 0; index < baseRows; index++) {
        array.push({
            x: GAME_SETTINGS.BASE_WIDTH - baseWidth,
            y: baseHeight * index,
            width: baseWidth,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                baseSidesImages.path,
                baseSidesImages.quantity
            )
        })
    }

    return array;
}

/**
 * @returns {import('../types.js').Tile[]}
 */
function generateMiddleInitialTilesPositions() {
    const array = [];
    const baseX = baseWidth;

    for (let index = 0; index < baseRows; index++) {
        array.push({
            x: baseX,
            y: baseHeight * index,
            width: baseWidthMiddle,
            height: baseHeight,
            velocityInY: 0,
            imageSource: utility.getRandomImage(
                baseMoatImages.path,
                baseMoatImages.quantity
            )
        });
    }

    return array;
}

/**
 * @returns {import('../types.js').Tile[]}
 */
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
    width: baseWidthMiddle,
    height: baseHeight,
    velocityInY: 0,
    isInMiddle: true,
},
{
    x: baseWidth + baseWidthMiddle,
    y: -baseHeight,
    width: baseWidth,
    height: baseHeight,
    velocityInY: 0,
},
]