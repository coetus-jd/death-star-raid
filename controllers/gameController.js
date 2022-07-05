import player from "../components/player.js";
import GAME_SETTINGS from "../constants/gameSettings.js";
import PLAYER_STATE from "../constants/playerState.js";
import GAME_STATES from "../constants/gameStates.js";

import { Log } from "../utils/log.js";

export default {
  checkIfPlayerHasLost() {
    if (player.life > 0) return;

    player.state = PLAYER_STATE.DEAD;
    Log.debug("Player is dead 💀");
  },
  lostGame() {
    GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATES.LOST;
    Log.debug("Lost game 😭");
  }
};
