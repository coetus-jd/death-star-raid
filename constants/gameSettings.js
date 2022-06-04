import GAME_STATE from "./gameStates.js";

export default {
    BASE_WIDTH: 1050,
    BASE_HEIGHT: 900,
    MAX_VELOCITY: 10,
    GRAVITY: 0.01,
    CURRENT_GAME_STATE: GAME_STATE.PLAY,
    LIMIT_IN_X: {
        MIN: 300,
        MAX: 750
    },
    LIMIT_IN_Y: {
        MIN: 0,
        MAX: 950
    },
    RECORD: 0,
    BEST_RECORD: 0,
};