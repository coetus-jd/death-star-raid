import GAME_SETTINGS from "../constants/gameSettings.js";
import LOCAL_STORAGE_KEYS from "../constants/localStorageKeys.js";

export default {
    addPoint: function (numberOfPoints = 1) {
        GAME_SETTINGS.RECORD += numberOfPoints;

        this.verifyCurrentScore();
    },
    verifyCurrentScore: function() {
        if (GAME_SETTINGS.RECORD <= GAME_SETTINGS.BEST_RECORD) return;

        GAME_SETTINGS.BEST_RECORD = GAME_SETTINGS.RECORD;
        localStorage.setItem(
            LOCAL_STORAGE_KEYS.RECORD,
            GAME_SETTINGS.RECORD
        );
    }
};