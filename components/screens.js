import gameSettings from "../constants/gameSettings.js";
import GAME_SETTINGS from "../constants/gameSettings.js";
import PLAYER_STATE from "../constants/playerState.js";

// Inicial Screen
const start = document.getElementById("content-start-game");
const bStart = document.getElementById("start-game");
const animStart = document.getElementById("animStart");
const game = document.getElementById("content-game");
var delay = 1000;

function awake(){

    sizeScreen();

}

function sizeScreen()
{
    start.style.height = gameSettings.BASE_HEIGHT;
    start.style.width = gameSettings.BASE_WIDTH;
}


document.addEventListener("keypress",(event) => {
    if (event.key === " " || event.code === 'Space') {
        displayStart();
    }
});

function displayStart(){
    if(bStart.value == 'NoStart'){
        bStart.style.color = "white";
        bStart.style.opacity = "0.7";
        bStart.style.transform = "scale(1.2)";
        bStart.style.backgroundColor = "black";
        animStart.style.display = "flex";

        setTimeout(function() {
            game.style.display = "block";
            bStart.value = 'Start';
            start.style.display = "none";
            main();
          }, delay);

        
    }
    else{
        // bStart.style.color = "black";
        // bStart.style.opacity = "1";
        // bStart.style.transform = "scale(1)";
        // bStart.style.backgroundColor ="darkGray";
        // start.style.display = "default";
        // bStart.value = 'NoStart';
    }
}

// Game Credits

const about = document.getElementById("content-game-credit");
const bAbout = document.getElementById("about");


function displayAbout(){
    if(bAbout.value == 'NoClick'){
        about.style.display = "block";
        bAbout.value = 'Click';
    }
    else{
        about.style.display = "none";
        bAbout.value = 'NoClick';
    }
}

// Game content

const left = document.getElementById("btn-left");
const space = document.getElementById("btn-space");
const right = document.getElementById("btn-right");

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
        left.style.opacity = "0.9";
        left.replaceChildren("A");
    }
    if (event.key === "ArrowLeft" || event.keyCode === 37) {
        left.style.opacity = "0.9";
        left.replaceChildren("←");
    }
    if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
        right.style.opacity = "0.9";
        right.replaceChildren("D");
    }
    if (event.key === "ArrowRight" || event.keyCode === 39) {
        right.style.opacity = "0.9";
        right.replaceChildren("→");
    }
    if (event.key === " " || event.code === 'Space') {
        space.style.opacity = "0.9";
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "a" || event.key === "A" || event.keyCode === 65) {
        left.style.opacity = "0.5";
    }
    if (event.key === "ArrowLeft" || event.keyCode === 37) {
        left.style.opacity = "0.5";
    }
    if (event.key === "d" || event.key === "D" || event.keyCode === 68) {
        right.style.opacity = "0.5";

    }
    if (event.key === "ArrowRight" || event.keyCode === 39) {
        right.style.opacity = "0.5";
    }
    if (event.key === " " || event.code === 'Space') {
        space.style.opacity = "0.5";
    }
    // console.log(event);
});

//Test Score Screen

// Precisa ser arrumado, pois quando apertar o debug, vai para o score (Como se o play morreu)

const endScreen = document.getElementById("content-score")

function DebugMode() {
    endScreen.style.display = "flex";
    game.style.display = "none";

}