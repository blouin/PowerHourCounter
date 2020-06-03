import { GAME_STATE_IN_PROGRESS } from '../store/store';
import { PLAYER_ADD, PLAYER_TOGGLE } from '../store/reducers/game';
import { SET_THEME, SET_LANGUAGE, SET_SOUND } from '../store/reducers/ui';
import { SET_FOLDER, SET_FILES } from '../store/reducers/photos';
import { isElectron, getFilesInFolder } from './electron';

const storageAvailable = () => {
    try {
        const storage = window.localStorage;
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return false;
    }
}

// ********
// Settings
// ********

const SETTINGS_KEY = "settings";

export const loadSettings = (store) => {
    if (storageAvailable()) {
        const settings = JSON.parse(window.localStorage.getItem(SETTINGS_KEY));
        if (settings) {
            if (settings.players && Array.isArray(settings.players)) {
                for (let i = 0; i < settings.players.length; i++) {
                    if (settings.players[i]) {
                        store.dispatch({ type: PLAYER_ADD, name: settings.players[i].name });
                        if (!settings.players[i].selected) {
                            const playerId = store.getState().game.players[store.getState().game.players.length - 1].id;
                            store.dispatch({ type: PLAYER_TOGGLE, playerId: playerId });
                        }
                    }
                }
            }
            if (settings.language && ['en', 'fr'].includes(settings.language.toLowerCase())) {
                store.dispatch({ type: SET_LANGUAGE, language: settings.language });
            }
            if (settings.theme && ['dark', 'light'].includes(settings.theme.toLowerCase())) {
                store.dispatch({ type: SET_THEME, theme: settings.theme });
            }
            if (typeof settings.sound !== 'undefined') {
                store.dispatch({ type: SET_SOUND, sound: settings.sound });
            }
            if (isElectron && settings.photos) {
                store.dispatch({ type: SET_FOLDER, folder: settings.photos });

                getFilesInFolder(settings.photos)
                    .then((files) => store.dispatch({ type: SET_FILES, files: files }))
                    .catch(() => {
                        store.dispatch({ type: SET_FOLDER, folder: '' });
                        store.dispatch({ type: SET_FILES, files: [] })
                    })
            }
        }
    }
}

export const saveSettings = (store) => {
    const state = store.getState();
    
    if (state.game.state !== GAME_STATE_IN_PROGRESS && storageAvailable()) {
        let settings = {
            language: state.ui.language,
            theme: state.ui.theme,
            sound: state.ui.sound,
            players: state.game.players.map((item, index) => ({ name: item.name, selected: item.selected })),
        };

        if (isElectron) {
            settings = {
                ...settings,
                photos: state.photos.folder
            }
        }

        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
}

// *******
// History
// *******

const HISTORY_KEY = "history";

export const loadHistory = () => {
    if (storageAvailable()) {
        return JSON.parse(window.localStorage.getItem(HISTORY_KEY));
    }
}

export const addHistory = (state) => {
    if (storageAvailable()) {
        const historyItem = {
            id: Date.now().toFixed(),
            date: new Date().toISOString().split('T')[0],
            totalShot: state.totalShot,
            players: state.players.filter(i => i.selected).map((item, index) => ({ name: item.name, lastShot: item.lastShot }))
        };

        const history = JSON.parse(window.localStorage.getItem(HISTORY_KEY)) || [];
        history.push(historyItem);
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
}

export const removeHistory = (id) => {
    let newHistory = [];

    if (storageAvailable()) {
        const history = JSON.parse(window.localStorage.getItem(HISTORY_KEY)) || [];
        newHistory = history.filter(item => item.id !== id);
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    }

    return newHistory;
}

export const clearHistory = () => {
    if (storageAvailable()) {
        window.localStorage.removeItem(HISTORY_KEY);
    }
}