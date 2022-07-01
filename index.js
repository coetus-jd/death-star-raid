import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";

import player from "./components/player.js";
import scenario from "./components/scenario.js";
import bullet from "./components/bullet.js";
import enemy from "./components/enemy.js";
import { Log } from "./utils/log.js";
import screens from "./components/screens.js";

/** Starts the game only when the DOM is fully loaded */
document.addEventListener("DOMContentLoaded", awake);

/** @type {CanvasRenderingContext2D} */
let canvasContext = null;
/** @type {CanvasRenderingContext2D} */
let canvasBackgroundContext = null;
/** @type {HTMLElement} */
let bestScoreText = null;
/** @type {HTMLElement} */
let currentScoreText = null;
/** @type {HTMLElement} */
let startButton = null;
/** @type {HTMLElement} */
let pauseButton = null;

/**
 * Configure the canvas, scenario and canvas contexts
 */
function awake() {
    getScore();
    configureTexts();

    configureButtons();
    configureCanvas();

    scenario.init(canvasBackgroundContext);
    enemy.init(canvasContext);
    bullet.init(canvasContext);
    player.init(canvasContext);

    scenario.createBasicElements();

    // start();
}

/**
 * Logic that will run multiple times
 * @returns {void}
 */
function run() {
    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED) return;

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
        lostGame(GAME_STATE.PLAY);
        return;
    }

    canvasContext.restore();
    canvasBackgroundContext.restore();

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
        Log.debug(`Record: ${GAME_SETTINGS.RECORD}`);
        Log.debug(`Life: ${player.life}`);

        currentScoreText.innerHTML = GAME_SETTINGS.RECORD;
        bestScoreText.innerHTML = GAME_SETTINGS.BEST_RECORD;

        scenario.create();
        scenario.update();
        scenario.draw();

        enemy.create();
        enemy.update();
        enemy.draw();

        bullet.update();
        bullet.draw();
    }

    player.draw();

    canvasContext.save();
    canvasBackgroundContext.save();

    window.requestAnimationFrame(run);
}

/**
 * Set canvas attributes and append it to the body of the document
 */
function configureCanvas() {
    const canvasBackground = document.createElement("canvas");
    canvasBackground.id = 'backgroundCanvas';
    canvasBackground.width = GAME_SETTINGS.BASE_WIDTH;
    canvasBackground.height = GAME_SETTINGS.BASE_HEIGHT;
    // canvas.style.border = "1px solid #000";

    canvasBackgroundContext = canvasBackground.getContext("2d", { alpha: false });
    // New shapes are drawn behind the existing canvas content
    // OBS: default is "source-over"
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    // canvasContext.globalCompositeOperation = "destination-over";

    document.body.appendChild(canvasBackground);

    const canvas = document.createElement("canvas");
    canvas.id = 'canvas';
    canvas.width = GAME_SETTINGS.BASE_WIDTH;
    canvas.height = GAME_SETTINGS.BASE_HEIGHT;
    // canvas.style.border = "1px solid #000";

    canvasContext = canvas.getContext("2d");

    document.body.appendChild(canvas);
    document.addEventListener("keydown", (event) => {
        if (event.key === " " || event.code === 'Space') {
            bullet.create();
        }
    });
}

/**
 * Verify if the user has a saved score, if yes, set it to the current record variable
 */
function getScore() {
    GAME_SETTINGS.RECORD = 0;

    let savedRecord = localStorage.getItem("record");

    if (!savedRecord) savedRecord = 0;

    GAME_SETTINGS.BEST_RECORD = savedRecord;
}

/**
 * Reset the game
 * @param {Number} gameState
 */
function lostGame(gameState) {
    player.reset();
    enemy.reset();
    bullet.reset();
    GAME_SETTINGS.CURRENT_GAME_STATE = gameState;
    bestScoreText.innerHTML = GAME_SETTINGS.BEST_RECORD;
}

/**
 * Init the game
 */
function startGame() {
    run();
    GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;
}

/**
 * Switch the GAME_STATE to PAUSED or PLAYING
 */
function switchPauseGame() {
    GAME_SETTINGS.CURRENT_GAME_STATE =
        GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED
        ? GAME_STATE.PLAYING
        : GAME_STATE.PAUSED;

    pauseButton.textContent = GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING
        ? 'Pause'
        : 'Unpause';

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) run();
}

/**
 * Configure the HTML buttons that will execute functions in the game
 */
function configureButtons() {
    startButton = document.getElementById("start");
    startButton.addEventListener("click", startGame);

    pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", switchPauseGame);

    // const restartButton = document.getElementById("restart");
    // restartButton.addEventListener("click", lostGame(GAME_STATE.PLAYING));
}

/**
 * Configure the HTML elements that will be used to show game's information
 */
function configureTexts() {
    bestScoreText = document.getElementById("best-score");
    currentScoreText = document.getElementById("current-score");
    bestScoreText.innerHTML = GAME_SETTINGS.BEST_RECORD || 'No best score yet';
    currentScoreText.innerHTML = GAME_SETTINGS.RECORD || 'No score yet';
}