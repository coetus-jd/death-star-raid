import GAME_STATE from "./constants/gameStates.js";
import GAME_SETTINGS from "./constants/gameSettings.js";

import player from "./components/player.js";
import scenario from "./components/scenario.js";
import bullet from "./components/bullet.js";
import enemy from "./components/enemy.js";
import { Log } from "./utils/log.js";
import scoreController from "./controllers/scoreController.js";

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
let currentScoreText = null;
/** @type {HTMLElement} */
let startButton = null;
/** @type {HTMLElement} */
let pauseButton = null;
/** @type {HTMLElement} */
let debugButton = null;

// Inicial Screen
const start = document.getElementById("content-start-game");
const bStart = document.getElementById("start-game");
const animStart = document.getElementById("animStart");
const game = document.getElementById("content-game");
const endScreen = document.getElementById("content-score");
const highScore = document.getElementById("high-score");
const btnReturn = document.getElementById("return");
let btnGit = document.getElementsByClassName("btn-github");
var delay = 1000;

function awake() {
  sizeScreen();
  showScore();

}

function sizeScreen() {
  start.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  start.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
  game.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  game.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
  endScreen.style.height = GAME_SETTINGS.BASE_HEIGHT + "px";
  endScreen.style.width = GAME_SETTINGS.BASE_WIDTH + "px";
}

document.addEventListener("keypress", (event) => {
  if (event.key === " " || event.code === "Space") {
    displayStart();
    if (bStart.value == "Start") {
      startGame();
    }
  }
});

function displayStart() {
  if (bStart.value == "NoStart") {
    animStart.style.display = "flex";

    setTimeout(function () {
      game.style.display = "block";
      bStart.value = "Start";
      start.style.display = "none";
      startPlay();
    }, delay);
  } 
}

// Game Credits

// const about = document.getElementById("content-game-credit");
// const bAbout = document.getElementById("about");

// bAbout.addEventListener("mouseenter", displayAbout);
// bAbout.addEventListener("mouseleave", displayAbout);

// function displayAbout(){
//     if(bAbout.value == 'NoClick'){
//         about.style.display = "block";
//         bAbout.value = 'Click';
//     }
//     else{
//         about.style.display = "none";
//         bAbout.value = 'NoClick';
//     }
// }

// Game content

const left = document.getElementById("btn-left");
const space = document.getElementById("btn-space");
const right = document.getElementById("btn-right");

document.addEventListener("keydown", (event) => {
  if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
    left.style.opacity = "1";
  }
  if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
    right.style.opacity = "1";
  }
  if (event.key === " " || event.code === "Space") {
    space.style.opacity = "1";
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
    left.style.opacity = "0";
  }
  if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
    right.style.opacity = "0";
  }
  if (event.key === " " || event.code === "Space") {
    space.style.opacity = "0";
  }
  // console.log(event);
});

//Score Screen

highScore.addEventListener("click", displayScore);
btnReturn.addEventListener("click", displayInicialScreen);
btnGit.addEventListener("click", openGitHub);

function displayScore() {
  endScreen.style.display = "block";
  game.style.display = "none";
  start.style.display = "none";
  showScore();
}

function displayInicialScreen() {
  endScreen.style.display = "none";
  game.style.display = "none";
  start.style.display = "block";
  bStart.value = "NoStart";
  animStart.style.display = "none";

}

function openGitHub() {
  window.open("https://github.com/coetus-jd", "_blank");
}


/**
 * Configure the canvas, scenario and canvas contexts
 */
function startPlay() {
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

  canvasContext.save();
  canvasBackgroundContext.save();

  if (GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING) {
    Log.debug(`Record: ${GAME_SETTINGS.RECORD}`);
    Log.debug(`Life: ${player.life}`);

    currentScoreText.innerHTML = GAME_SETTINGS.RECORD;
    firstScore.innerHTML = GAME_SETTINGS.BEST_RECORD;

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
  // canvas.style.border = "1px solid #000";

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
  // canvas.style.border = "1px solid #000";

  canvasContext = canvas.getContext("2d");

  document.body.appendChild(canvas);
  document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
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

}

/**
 * Reset the game
 * @param {Number} gameState
 */
function lostGame(gameState) { 
  bStart.value = "Credits";
  GAME_SETTINGS.CURRENT_GAME_STATE = gameState;
  scoreController.verifyCurrentScore();
  setTimeout(function () {
    player.reset();
    enemy.reset();
    bullet.reset();
    document.getElementById("backgroundCanvas").parentNode.removeChild(document.getElementById("backgroundCanvas"));
    document.getElementById("canvas").parentNode.removeChild(document.getElementById("canvas"));
    displayScore();
  }, delay);

}

/**
 * Init the game
 */
function startGame() {
  if (GAME_SETTINGS.CURRENT_GAME_STATE != GAME_STATE.PLAYING) {
    run();
    GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATE.PLAYING;
  }
}

/**
 * Switch the GAME_STATE to PAUSED or PLAYING
 */
function switchPauseGame() {
  GAME_SETTINGS.CURRENT_GAME_STATE =
    GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PAUSED
      ? GAME_STATE.PLAYING
      : GAME_STATE.PAUSED;

  pauseButton.textContent =
    GAME_SETTINGS.CURRENT_GAME_STATE === GAME_STATE.PLAYING
      ? "Pause"
      : "Unpause";

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

  debugButton = document.getElementById("debugmode");
  debugButton.addEventListener("click", setDebugMode);
}

/**
 * Configure the HTML elements that will be used to show game's information
 */
function configureTexts() {
  currentScoreText = document.getElementById("current-score");
  currentScoreText.innerHTML = GAME_SETTINGS.RECORD || "000000";
}

// Show score in score Screen

function showScore() {
  firstScore = document.getElementById("first-score");
  firstScore.innerHTML = ("000000" + Number(localStorage.first)).slice(-6) || "000000";
  secondScore = document.getElementById("second-score");
  secondScore.innerHTML = ("000000" + Number(localStorage.second)).slice(-6) || "000000";
  thirdScore = document.getElementById("third-score");
  thirdScore.innerHTML = ("000000" + Number(localStorage.third)).slice(-6) || "000000";
  forthScore = document.getElementById("forth-score");
  forthScore.innerHTML = ("000000" + Number(localStorage.forth)).slice(-6) || "000000";
  fifthScore = document.getElementById("fifth-score");
  fifthScore.innerHTML = ("000000" + Number(localStorage.fifth)).slice(-6) || "000000";
}


function setDebugMode() {
  GAME_SETTINGS.DEBUG.DEBUG_ENABLED = true;
  GAME_SETTINGS.LOGS.DEBUG_ENABLED = true;
}
