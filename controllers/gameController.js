import player from "../components/player.js"
import GAME_SETTINGS from "../constants/gameSettings.js";
import PLAYER_STATE from "../constants/playerState.js";

import { Log } from "../utils/log.js";

export default {
    checkIfPlayerHasLost() {
        if (player.life > 0) return;

        GAME_SETTINGS.CURRENT_GAME_STATE = GAME_STATES.LOST;
        player.state = PLAYER_STATE.DEAD;
        Log.warn('Player has lost');
    }
}