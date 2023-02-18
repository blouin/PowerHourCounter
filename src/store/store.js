import { throttle } from 'lodash';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import { loadSettings, saveSettings } from '../utilities/storage';

export const GAME_STATE_READY = 0;
export const GAME_STATE_IN_PROGRESS = 1;
export const GAME_STATE_COMPLETE = 2;
export const GAME_VARIANT_CLASSIC = 'classic';
export const GAME_VARIANT_BLITZKRIEG  = 'blitzkrieg';
export const GAME_VARIANT_POWER = 'power';
export const UPDATE_NA = 0;
export const UPDATE_AVAILABLE = 1;
export const UPDATE_DOWNLOADED = 2;
export const PHOTOS_STATE_NA = 0;
export const PHOTOS_STATE_LOADING = 1;
export const PHOTOS_STATE_READY = 2;
export const LANGUAGE_DEFAULT = 'DEFAULT';
export const INSTRUCTION_IMAGE_HACK = 'INSTRUCTION_IMAGE_HACK';

const defaultState = {
    game: {
        state: GAME_STATE_READY,
        variant: GAME_VARIANT_CLASSIC,
        currentTime: 5,
        currentShot: 0,
        totalShot: 60,
        players: [],
        currentImageUrl: INSTRUCTION_IMAGE_HACK // DO NOT REMOVE!!! This hack makes the instructions keep showing till first image
    },
    ui: {
        language: LANGUAGE_DEFAULT,
        theme: 'light',
        sound: true,
        update: UPDATE_NA
    },
    photos: {
        folder: '',
        state: PHOTOS_STATE_NA,
        files: []
    }
}

const store = createStore(rootReducer, defaultState, composeWithDevTools());

loadSettings(store);
store.subscribe(throttle(() => {
    saveSettings(store);
}, 1000));

export default store;