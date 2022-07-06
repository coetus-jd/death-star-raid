import GAME_SETTINGS from "../constants/gameSettings.js";

/**
 * Class to log on console based on configurations
 * @author Fabrício Pinto Ferreira
 */
export class Log {
    /**
     * Create a message on console with debug purpose
     * @param {string} messages 
     * @returns {void}
     */
    static debug(messages) {
        if (!GAME_SETTINGS.LOGS.DEBUG_ENABLED) return;

        console.debug(messages);
    }

    /**
     * Create a message on console with warning purpose
     * @param {string} messages 
     * @returns {void}
     */
    static warn(messages) {
        if (!GAME_SETTINGS.LOGS.WARN_ENABLED) return;

        console.warn(messages);
    }

    /**
     * Create a message on console with error purpose
     * @param {string} messages 
     * @returns {void}
     */
    static error(messages) {
        if (!GAME_SETTINGS.LOGS.ERROR_ENABLED) return;

        console.error(messages);
    }
}