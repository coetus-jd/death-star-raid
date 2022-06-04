import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";

import player from "./components/player.js";
import scenario from "./components/scenario.js";
import bullet from "./components/bullet.js";
import enemy from "./components/enemy.js";

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

function awake() {
    GAME_SETTINGS.BEST_RECORD = localStorage.getItem("record");

    configureTexts();

    configureButtons();
    configureCanvas();
    getScore();

    scenario.init(canvasBackgroundContext);
    enemy.init(canvasContext);
    bullet.init(canvasContext);
    player.init(canvasContext);

    scenario.createBasicElements();

    // start();
}

function start() {
    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED) {
        return;
    }

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
        lostGame(GAME_STATE.PLAY);
        return;
    }

    // canvasContext.restore();
    // canvasBackgroundContext.restore();

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
        console.debug(`Record: ${GAME_SETTINGS.RECORD}`);
        console.debug(`Life: ${player.life}`);

        currentScoreText.innerHTML = GAME_SETTINGS.RECORD;

        scenario.create();
        scenario.draw();
        scenario.update();

        enemy.create();
        enemy.update();
        enemy.draw();

        bullet.update();
        bullet.draw();
    }

    // drawElements();

    player.draw();
    player.update();

    // canvasContext.save();
    // canvasBackgroundContext.save();

    window.requestAnimationFrame(start);
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
    // document.addEventListener("mousedown", handleGameState);
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
    let savedRecord = localStorage.getItem("record");

    if (!savedRecord) savedRecord = 0;

    GAME_SETTINGS.RECORD = savedRecord;
}

/**
 * Handle the possibles games states
 */
function handleGameState() {
    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAY) {
        GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;
    }

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {}

    // if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) lostGame();
}

/**
 * Draw all the necessary elements for the game
 * 
 * New shapes are drawn behind the existing canvas content
 * because of the globalCompositeOperation property
 */
function drawElements() {
    player.draw();
}

function lostGame(state) {
    player.reset();
    enemy.reset();
    bullet.reset();
    GAME_SETTINGS.CURRENT_GAME_STATE = state;
    bestScoreText.innerHTML = GAME_SETTINGS.BEST_RECORD;
}

function startGame() {
    start();
    GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;
}

function pauseGame() {
    GAME_SETTINGS.CURRENT_GAME_STATE =
        GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED ?
        GAME_STATE.PLAYING :
        GAME_STATE.PAUSED;

    if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING)
        start();
}

function configureButtons() {
    const startButton = document.getElementById("start");
    startButton.addEventListener("click", startGame);

    const pauseButton = document.getElementById("pause");
    pauseButton.addEventListener("click", pauseGame);

    // const restartButton = document.getElementById("restart");
    // restartButton.addEventListener("click", lostGame(GAME_STATE.PLAYING));
}

function configureTexts() {
    bestScoreText = document.getElementById("best-score");
    currentScoreText = document.getElementById("current-score");
    bestScoreText.innerHTML = GAME_SETTINGS.BEST_RECORD || 'No best score yet';
    currentScoreText.innerHTML = GAME_SETTINGS.RECORD || 'No score yet';
}