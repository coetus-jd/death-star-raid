import GAME_SETTINGS from "../constants/gameSettings.js";
import LOCAL_STORAGE_KEYS from "../constants/localStorageKeys.js";

export default {
  /**
   * Add points to the player's record
   * @param {number} numberOfPoints Number of points to be added on player's record. Default is `1`
   */
  addPoint: function (numberOfPoints = 1) {
    GAME_SETTINGS.RECORD += numberOfPoints;
  },
  /**
   * Set the player name
   * @param {string} playerName Player's name
   */
  addName: function (playerName) {
    GAME_SETTINGS.RECORD_NAME = playerName;
  },
  verifyNewScore: function () {
    const fifthRecord = Number(
      localStorage.getItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD)
    );

    GAME_SETTINGS.NEW_SCORE = GAME_SETTINGS.RECORD >= fifthRecord;
  },
  verifyCurrentScore: function () {
    if (GAME_SETTINGS.RECORD <= Number(localStorage.fifth)) return;
    else if (GAME_SETTINGS.RECORD > Number(localStorage.first)) {
      //Record
      localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD, localStorage.forth);
      localStorage.setItem(LOCAL_STORAGE_KEYS.FORTH_RECORD, localStorage.third);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_RECORD,
        localStorage.second
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SECOND_RECORD,
        localStorage.first
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIRST_RECORD,
        GAME_SETTINGS.RECORD
      );

      //Name record
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_NAME,
        localStorage.forthName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORTH_NAME,
        localStorage.thirdName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_NAME,
        localStorage.secondName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SECOND_NAME,
        localStorage.firstName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIRST_NAME,
        GAME_SETTINGS.RECORD_NAME
      );
    } else if (GAME_SETTINGS.RECORD > Number(localStorage.second)) {
      //Record

      localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD, localStorage.forth);
      localStorage.setItem(LOCAL_STORAGE_KEYS.FORTH_RECORD, localStorage.third);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_RECORD,
        localStorage.second
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SECOND_RECORD,
        GAME_SETTINGS.RECORD
      );

      //Name Record

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_NAME,
        localStorage.forthName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORTH_NAME,
        localStorage.thirdName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_NAME,
        localStorage.secondName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SECOND_NAME,
        GAME_SETTINGS.RECORD_NAME
      );
    } else if (GAME_SETTINGS.RECORD > Number(localStorage.third)) {
      //Record

      localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD, localStorage.forth);
      localStorage.setItem(LOCAL_STORAGE_KEYS.FORTH_RECORD, localStorage.third);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_RECORD,
        GAME_SETTINGS.RECORD
      );

      //Name Record

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_NAME,
        localStorage.forthName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORTH_NAME,
        localStorage.thirdName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.THIRD_NAME,
        GAME_SETTINGS.RECORD_NAME
      );
    } else if (GAME_SETTINGS.RECORD > Number(localStorage.forth)) {
      //Record

      localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD, localStorage.forth);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORTH_RECORD,
        GAME_SETTINGS.RECORD
      );

      //Record Name

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_NAME,
        localStorage.forthName
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FORTH_NAME,
        GAME_SETTINGS.RECORD_NAME
      );
    } else if (GAME_SETTINGS.RECORD > Number(localStorage.fifth)) {
      //Record

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_RECORD,
        GAME_SETTINGS.RECORD
      );

      //Name Record

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FIFTH_NAME,
        GAME_SETTINGS.RECORD_NAME
      );
    }
  },
  verifyLocalScore: function () {
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FIRST_RECORD, 0);
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.SECOND_RECORD, 0);
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.THIRD_RECORD, 0);
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FORTH_RECORD, 0);
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FIFTH_RECORD, 0);

    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FIRST_NAME, "...");
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.SECOND_NAME, "...");
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.THIRD_NAME, "...");
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FORTH_NAME, "...");
    resetValuesOnLocalStorage(LOCAL_STORAGE_KEYS.FIFTH_NAME, "...");
  },
  resetLocalScore: function () {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FIRST_RECORD, 0);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECOND_RECORD, 0);
    localStorage.setItem(LOCAL_STORAGE_KEYS.THIRD_RECORD, 0);
    localStorage.setItem(LOCAL_STORAGE_KEYS.FORTH_RECORD, 0);
    localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_RECORD, 0);

    localStorage.setItem(LOCAL_STORAGE_KEYS.FIRST_NAME, "...");
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECOND_NAME, "...");
    localStorage.setItem(LOCAL_STORAGE_KEYS.THIRD_NAME, "...");
    localStorage.setItem(LOCAL_STORAGE_KEYS.FORTH_NAME, "...");
    localStorage.setItem(LOCAL_STORAGE_KEYS.FIFTH_NAME, "...");
  },
};

function resetValuesOnLocalStorage(nameOfLocalStorageKey, defaultValue) {
  const valeuOnLocalStorage = localStorage.getItem(nameOfLocalStorageKey);

  if (!valeuOnLocalStorage) {
    localStorage.setItem(nameOfLocalStorageKey, defaultValue);
  }
}
