import GAME_SETTINGS from "../constants/gameSettings.js";

export class Log {
    static debug(messages) {
        if (!GAME_SETTINGS.LOGS.DEBUG_ENABLED) return;

        console.debug(messages);
    }

    static warn(messages) {
        if (!GAME_SETTINGS.LOGS.WARN_ENABLED) return;

        console.warn(messages);
    }

    static error(messages) {
        if (!GAME_SETTINGS.LOGS.ERROR_ENABLED) return;

        console.error(messages);
    }
}