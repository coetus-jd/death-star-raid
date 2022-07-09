import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";
import LOCAL_STORAGE_KEYS from "./constants/localStorageKeys.js";

import scoreController from "./controllers/scoreController.js";

import player from "./components/player.js";
import scenario from "./components/scenario.js";
import bullet from "./components/bullet.js";
import enemy from "./components/enemy.js";
import { Log } from "./utils/log.js";

/** Starts the game only when the DOM is fully loaded */
document.addEventListener("DOMContentLoaded", awake);

/** @type {CanvasRenderingContext2D} */
let canvasContext = null;
/** @type {CanvasRenderingContext2D} */
let canvasBackgroundContext = null;
/** @type {HTMLElement} */
let firstScore = null;
/** @type {HTMLElement} */
let secondScore = null;
/** @type {HTMLElement} */
let thirdScore = null;
/** @type {HTMLElement} */
let forthScore = null;
/** @type {HTMLElement} */
let fifthScore = null;
/** @type {HTMLElement} */
let firstName = null;
/** @type {HTMLElement} */
let secondName = null;
/** @type {HTMLElement} */
let thirdName = null;
/** @type {HTMLElement} */
let forthName = null;
/** @type {HTMLElement} */
let fifthName = null;
/** @type {HTMLElement} */
let currentScoreText = null;
/** @type {HTMLElement} */
let pauseButton = null;
/** @type {HTMLElement} */
let debugButton = null;
let creditsOn = false;

// Sound config
const soundLaser = new Audio();

// Inicial Screen
const start = document.getElementById("content-start-game");
const btnStart = document.getElementById("start-game");
const animStart = document.getElementById("animStart");
const game = document.getElementById("content-game");
const endScreen = document.getElementById("content-score");
const highScore = document.getElementById("high-score");
const btnReturn = document.getElementById("return");
const btnGitStart = document.getElementById("git-hub");
const btnGitScore = document.getElementById("git-hub-score");
const btnReset = document.getElementById("reset");

// Game content
const left = document.getElementById("btn-left");
const space = document.getElementById("btn-space");
const right = document.getElementById("btn-right");
const pause = document.getElementById("pause");

//Score Screen
const inputName = document.getElementById("credits-name");
const sendName = document.getElementById("send");
const creditScreen = document.getElementById("content-game-credit");

/**
 * Primary game configurations
 */
function awake() {
  sizeScreen();
  showScore();
  soundConfig();
  configureGameEventsListeners();
  scoreController.verifyLocalScore();
}

function soundConfig() {
  soundLaser.src = "./assets/Sounds/TieFighterSound.mp3";
}

function sizeScreen() {
  start.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  start.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
  game.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  game.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
  endScreen.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  endScreen.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
}

function configureGameEventsListeners() {
  document.addEventListener("keypress", (event) => {
    if (event.key === " " || event.code === "Space") {
      displayStart();

      if (btnStart.value == "Start") {
        startGame();
      }
    }

    if ((event.key === "Enter" || event.code === "Enter") && creditsOn) {
      scoreController.addName(inputName.value);
      sendName.click();
      creditScreen.style.display = "none";
      creditsOn = false;
      lostGame(GAME_STATE.PLAY);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "a" ||
      event.key === "A" ||
      event.keyCode === 65 ||
      event.key === "ArrowLeft" ||
      event.keyCode === 37
    ) {
      left.style.opacity = "1";
    }
    if (
      event.key === "d" ||
      event.key === "D" ||
      event.keyCode === 68 ||
      event.key === "ArrowRight" ||
      event.keyCode === 39
    ) {
      right.style.opacity = "1";
    }
    if (event.key === " " || event.code === "Space") {
      space.style.opacity = "1";
    }
  });

  document.addEventListener("keyup", (event) => {
    if (
      event.key === "a" ||
      event.key === "A" ||
      event.keyCode === 65 ||
      event.key === "ArrowLeft" ||
      event.keyCode === 37
    ) {
      left.style.opacity = "0";
    }

    if (
      event.key === "d" ||
      event.key === "D" ||
      event.keyCode === 68 ||
      event.key === "ArrowRight" ||
      event.keyCode === 39
    ) {
      right.style.opacity = "0";
    }

    if (event.key === " " || event.code === "Space") {
      space.style.opacity = "0";
    }
  });

  highScore.addEventListener("click", displayScore);
  btnReturn.addEventListener("click", displayInicialScreen);
  btnGitStart.addEventListener("click", openGitHub);
  btnGitScore.addEventListener("click", openGitHub);
  btnReset.addEventListener("click", resetLocalScore);
}

function displayStart() {
  if (btnStart.value !== "NoStart") return;

  animStart.style.display = "flex";
  soundLaser.play();

  setTimeout(() => {
    game.style.display = "block";
    pause.style.animation = "none";
    btnStart.value = "Start";
    start.style.display = "none";
    startPlay();
  }, 1000);
}

function displayScore() {
  endScreen.style.display = "block";
  game.style.display = "none";
  start.style.display = "none";
  showScore();
}

function writeName() {
  creditScreen.style.display = "block";
  creditsOn = true;
}

function resetLocalScore() {
  scoreController.resetLocalScore();
  showScore();
}

function displayInicialScreen() {
  endScreen.style.display = "none";
  game.style.display = "none";
  start.style.display = "block";
  btnStart.value = "NoStart";
  animStart.style.display = "none";
}

function openGitHub() {
  window.open("https://github.com/coetus-jd/death-star-raid", "_blank");
}

/**
 * Configure the canvas, scenario and canvas contexts
 */
function startPlay() {
  getScore();
  configureTexts();
  configureButtons();
  configureCanvas();

  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
      bullet.create();
    }
  });

  scenario.init(canvasBackgroundContext);
  enemy.init(canvasContext);
  bullet.init(canvasContext);
  player.init(canvasContext);

  scenario.createBasicElements();
}

/**
 * Logic that will run multiple times
 * @returns {void}
 */
function run() {
  if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED) return;

  if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.LOST) {
    scoreController.verifyNewScore();
    game.style.display = "none";

    if (GAME_SETTINGS.NEW_SCORE === true) {
      writeName();
    } else {
      lostGame(GAME_STATE.PLAY);
    }
    return;
  }

  canvasContext.save();
  canvasBackgroundContext.save();

  if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
    Log.debug(`Record: ${GAME_SETTINGS.RECORD}`);
    Log.debug(`Life: ${player.life}`);

    currentScoreText.innerHTML = GAME_SETTINGS.RECORD;

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

  canvasContext.restore();
  canvasBackgroundContext.restore();

  window.requestAnimationFrame(run);
}

/**
 * Set canvas attributes and append it to the body of the document
 */
function configureCanvas() {
  const canvasBackground = document.createElement("canvas");
  canvasBackground.id = "backgroundCanvas";
  canvasBackground.width = GAME_SETTINGS.BASE_WIDTH;
  canvasBackground.height = GAME_SETTINGS.BASE_HEIGHT;

  canvasBackgroundContext = canvasBackground.getContext("2d", { alpha: false });

  // New shapes are drawn behind the existing canvas content
  // OBS: default is "source-over"
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // canvasContext.globalCompositeOperation = "destination-over";

  document.body.appendChild(canvasBackground);

  const canvas = document.createElement("canvas");
  canvas.id = "canvas";
  canvas.width = GAME_SETTINGS.BASE_WIDTH;
  canvas.height = GAME_SETTINGS.BASE_HEIGHT;

  canvasContext = canvas.getContext("2d");

  document.body.appendChild(canvas);
}

/**
 * Verify if the user has a saved score, if yes, set it to the current record variable
 */
function getScore() {
  GAME_SETTINGS.RECORD = 0;

  let savedRecord = localStorage.getItem("record");

  if (!savedRecord) savedRecord = 0;
}

/**
 * Reset the game
 * @param {Number} gameState
 */
function lostGame(gameState) {
  scoreController.verifyCurrentScore();
  GAME_SETTINGS.CURRENT_GAME_STATE = gameState;
  player.reset();
  enemy.reset();
  bullet.reset();

  removeCanvas();
  displayScore();
}

/**
 * Remove background and normal canvas from the DOM
 */
function removeCanvas() {
  document
    .getElementById("backgroundCanvas")
    .parentNode.removeChild(document.getElementById("backgroundCanvas"));

  document
    .getElementById("canvas")
    .parentNode.removeChild(document.getElementById("canvas"));
}

/**
 * Init the game
 */
function startGame() {
  GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;
  btnStart.value = "Credits";
  run();
}

/**
 * Switch the GAME_STATE to PAUSED or PLAYING
 */
function switchPauseGame() {
  GAME_SETTINGS.CURRENT_GAME_STATE =
    GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED
      ? GAME_STATE.PLAYING
      : GAME_STATE.PAUSED;

  GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING
    ? (pause.style.animation = "none")
    : (pause.style.animation = "");

  if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) run();
}

/**
 * Configure the HTML buttons that will execute functions in the game
 */
function configureButtons() {
  pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", switchPauseGame);

  debugButton = document.getElementById("debugmode");
  debugButton.addEventListener("click", toggleDebugMode);
}

/**
 * Configure the HTML elements that will be used to show game's information
 */
function configureTexts() {
  currentScoreText = document.getElementById("current-score");
  currentScoreText.innerHTML = GAME_SETTINGS.RECORD || "000000";
}

/**
 * Show score in score Screen
 */
function showScore() {
  setNumberToShowOnScoreScreen("first-score", LOCAL_STORAGE_KEYS.FIRST_RECORD);
  setNumberToShowOnScoreScreen(
    "second-score",
    LOCAL_STORAGE_KEYS.SECOND_RECORD
  );
  setNumberToShowOnScoreScreen("third-score", LOCAL_STORAGE_KEYS.THIRD_RECORD);
  setNumberToShowOnScoreScreen("forth-score", LOCAL_STORAGE_KEYS.FORTH_RECORD);
  setNumberToShowOnScoreScreen("fifth-score", LOCAL_STORAGE_KEYS.FIFTH_RECORD);

  setNameToShowOnScoreScreen("first-name", LOCAL_STORAGE_KEYS.FIRST_NAME);
  setNameToShowOnScoreScreen("second-name", LOCAL_STORAGE_KEYS.SECOND_NAME);
  setNameToShowOnScoreScreen("third-name", LOCAL_STORAGE_KEYS.THIRD_NAME);
  setNameToShowOnScoreScreen("forth-name", LOCAL_STORAGE_KEYS.FORTH_NAME);
  setNameToShowOnScoreScreen("fifth-name", LOCAL_STORAGE_KEYS.FIFTH_NAME);
}

function toggleDebugMode() {
  GAME_SETTINGS.DEBUG.DEBUG_ENABLED = !GAME_SETTINGS.DEBUG.DEBUG_ENABLED;
  GAME_SETTINGS.LOGS.DEBUG_ENABLED = !GAME_SETTINGS.LOGS.DEBUG_ENABLED;
}

/**
 * @param {string} idOfElementOnDom
 * @param {string} nameOfLocalStorageKey
 */
function setNumberToShowOnScoreScreen(idOfElementOnDom, nameOfLocalStorageKey) {
  const scoreToSet = document.getElementById(idOfElementOnDom);
  const localStorageValue = Number(
    localStorage.getItem(nameOfLocalStorageKey) || "0"
  );

  scoreToSet.innerHTML = ("000000" + localStorageValue).slice(-6) || "000000";
}

/**
 * @param {string} idOfElementOnDom
 * @param {string} nameOfLocalStorageKey
 */
function setNameToShowOnScoreScreen(idOfElementOnDom, nameOfLocalStorageKey) {
  const nameToSet = document.getElementById(idOfElementOnDom);
  const localStorageValue =
    localStorage.getItem(nameOfLocalStorageKey) || "...";

  nameToSet.innerHTML = ("..." + localStorageValue).slice(-3) || "...";
}
