import GAME_SETTINGS from "../constants/gameSettings.js";
import LOCAL_STORAGE_KEYS from "../constants/localStorageKeys.js";

export default {
    addPoint: function (numberOfPoints = 1) {
        GAME_SETTINGS.RECORD += numberOfPoints;

    },
    verifyCurrentScore: function() {

        if(localStorage.first == null){
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIRST_RECORD,
                0
            )
        }
        if(localStorage.second == null){
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.SECOND_RECORD,
                0
            )
        }
        if(localStorage.third == null){
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.THIRD_RECORD,
                0
            )
        }
        if(localStorage.forth == null){
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FORTH_RECORD,
                0
            )
        }
        if(localStorage.fifth == null){
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                0
            )
        }

        if (GAME_SETTINGS.RECORD <= Number(localStorage.fifth)) return;

        else if(GAME_SETTINGS.RECORD > Number(localStorage.first))
        {

            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                localStorage.forth
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FORTH_RECORD,
                localStorage.third
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.THIRD_RECORD,
                localStorage.second
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.SECOND_RECORD,
                localStorage.first
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIRST_RECORD,
                GAME_SETTINGS.RECORD
            )

        }
        else if(GAME_SETTINGS.RECORD > Number(localStorage.second))
        {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                localStorage.forth
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FORTH_RECORD,
                localStorage.third
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.THIRD_RECORD,
                localStorage.second
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.SECOND_RECORD,
                GAME_SETTINGS.RECORD
            )
        }
        else if(GAME_SETTINGS.RECORD > Number(localStorage.third))
        {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                localStorage.forth
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FORTH_RECORD,
                LlocalStorage.third
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.THIRD_RECORD,
                GAME_SETTINGS.RECORD
            )
        }
        else if(GAME_SETTINGS.RECORD > Number(localStorage.forth))
        {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                localStorage.forth
            )
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FORTH_RECORD,
                GAME_SETTINGS.RECORD
            )
        }
        else if(GAME_SETTINGS.RECORD > Number(localStorage.fifth))
        {
            localStorage.setItem(
                LOCAL_STORAGE_KEYS.FIFTH_RECORD,
                GAME_SETTINGS.RECORD
            )
        }
        
    }
};