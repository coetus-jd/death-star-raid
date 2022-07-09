import GAME_STATE from "./gameStates.js";

/**
 * Basic configurations and settings for the game
 */
export default {
  BASE_WIDTH: 1050,
  BASE_HEIGHT: 900,
  MAX_VELOCITY: 10,
  GRAVITY: 0.01,
  /** Enum from {@link gameStates.js} */
  CURRENT_GAME_STATE: GAME_STATE.PLAY,
  LIMIT_IN_X: {
    MIN: 300,
    MAX: 750,
  },
  LIMIT_IN_Y: {
    MIN: 0,
    MAX: 950,
  },
  RECORD: 0,
  RECORD_NAME: "...",
  DEBUG: {
    DEBUG_ENABLED: false,
  },
  LOGS: {
    DEBUG_ENABLED: false,
    WARN_ENABLED: true,
    ERROR_ENABLED: true,
  },
  NEW_SCORE: false,
};
