import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";

import player from "./components/player.js";
import obstacle from "./components/obstacle.js";
import floor from "./components/floor.js";

import { drawRectangle, drawRectangleWithGradient, drawText, init as initUtils, getRandomElement } from "./utils/index.js";

/** Starts the game only when the DOM was fully loaded */
document.addEventListener("DOMContentLoaded", main);

/** @type {CanvasRenderingContext2D} */
let canvasContext = null;

function main() {
    configureCanvas();
    getScore();
    initUtils(canvasContext);

    run();
}

function run() {
    drawElements();
    player.update();

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
        obstacle.draw();
        obstacle.update();
    }

    window.requestAnimationFrame(run);
}

/**
 * Set canvas attributes and append it to the body of the document
 */
function configureCanvas() {
    const canvas = document.createElement("canvas")
    canvas.width = GAME_SETTINGS.BASE_WIDTH;
    canvas.height = GAME_SETTINGS.BASE_HEIGHT;
    canvas.style.border = "1px solid #000";

    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    document.addEventListener("mousedown", handleGameState);
}

/**
 * Verify if the user has a saved score, if yes, set it to the current record variable
 */
function getScore() {
    let savedRecord = localStorage.getItem("record");

    if (!savedRecord) savedRecord = 0;

    GAME_SETTINGS.RECORD = savedRecord;
}

/**
 * Handle the possibles games states
 */
function handleGameState() {
    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAY) GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) { }

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
        player.reset();
        obstacle.clear();
        GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAY;
    }
}

/**
 * Draw all the necessary elements for the game
 */
function drawElements() {
    // Sky
    drawRectangle(0, 0, GAME_SETTINGS.BASE_WIDTH, GAME_SETTINGS.BASE_HEIGHT, "#53d6ed");
    // Floor
    drawRectangle(floor.x, floor.y, GAME_SETTINGS.BASE_WIDTH, 200, "#cf9044");
    // Player
    drawRectangleWithGradient(
        player.x,
        player.y,
        player.width,
        player.height,
        player.color,
        "#FF0000"
    );

    // Current score
    drawText(player.score || 'No score', 20, 100);

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAY) {
        drawRectangle(GAME_SETTINGS.BASE_WIDTH / 2 - 50, GAME_SETTINGS.BASE_HEIGHT / 2 - 50, 100, 100, "green");
    }

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
        drawRectangle(GAME_SETTINGS.BASE_WIDTH / 2 - 50, GAME_SETTINGS.BASE_HEIGHT / 2 - 50, 100, 100, "red");
        // Score
        drawScore();
    }
}

function drawScore() {
    canvasContext.save();

    if (player.score > GAME_SETTINGS.RECORD)
        drawText("New record!", (GAME_SETTINGS.BASE_WIDTH / 2) - 125, (GAME_SETTINGS.BASE_HEIGHT / 2) - 100);
    else if (GAME_SETTINGS.RECORD < 10)
        drawText(`Record: ${GAME_SETTINGS.RECORD}`, (GAME_SETTINGS.BASE_WIDTH / 2) - 120, (GAME_SETTINGS.BASE_HEIGHT / 2) - 100);
    else if (GAME_SETTINGS.RECORD > 10 && GAME_SETTINGS.RECORD < 100)
        drawText(`Record: ${GAME_SETTINGS.RECORD}`, (GAME_SETTINGS.BASE_WIDTH / 2) - 120, (GAME_SETTINGS.BASE_HEIGHT / 2) - 100);
    else
        drawText(`Record: ${GAME_SETTINGS.RECORD}`, (GAME_SETTINGS.BASE_WIDTH / 2) - 115, (GAME_SETTINGS.BASE_HEIGHT / 2) - 100);

    if (player.score < 10)
        drawText(player.score, GAME_SETTINGS.BASE_WIDTH / 2 - 15, GAME_SETTINGS.BASE_HEIGHT / 2 + 20);
    else if (player.score >= 10 && player.score < 100)
        drawText(player.score, GAME_SETTINGS.BASE_WIDTH / 2 - 30, GAME_SETTINGS.BASE_HEIGHT / 2 + 20);
    else
        drawText(player.score, GAME_SETTINGS.BASE_WIDTH / 2 - 45, GAME_SETTINGS.BASE_HEIGHT / 2 + 20);

    canvasContext.restore();
}

