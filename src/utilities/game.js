import { default as store, GAME_STATE_COMPLETE } from '../store/store';
import { UPDATE_GAME_IMAGE, STOP_GAME } from '../store/reducers/game';
import { addHistory } from './storage';
import { logGameEnd } from './analytics';

// ***********
// Done images
// ***********

import * as done1 from '../assets/done-1.png';
import * as done2 from '../assets/done-2.png';
import * as done3 from '../assets/done-3.png';
import * as done4 from '../assets/done-4.png';
const done = [ done1, done2, done3, done4 ];

const getEndImage = () => {
    return done[Math.floor(Math.random() * done.length)];
}

export const endGame = () => {
    const endImage = getEndImage();
    store.dispatch({ type: UPDATE_GAME_IMAGE, imageUrl: endImage });
    store.dispatch({ type: STOP_GAME });
    logGameEnd('Done', store.getState().game.currentShot + 1, store.getState().game.totalShot); // +1 (still in dispatch)
    addHistory(store.getState().game);
}

export const checkLastPlayerQuit = (currentState, newPlayers) => {
    const endImageUrl = getEndImage();

    // Check if we need to stop game
    let newState = GAME_STATE_COMPLETE;
    let newImageUrl = endImageUrl;
    newPlayers
        .filter(item => item.selected)
        .forEach(
            (item) => {
                    if (item.lastShot === -1) {
                        newState = currentState.state;
                        newImageUrl = currentState.currentImageUrl;
                    }
                }
            ); 

    // Save history
    if (newState === GAME_STATE_COMPLETE) {
        logGameEnd('AllQuit', currentState.currentShot, currentState.totalShot);
        addHistory({...currentState, players: newPlayers});
    }

    return { newState, newImageUrl };
}