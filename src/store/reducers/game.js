import { GAME_STATE_IN_PROGRESS, GAME_STATE_COMPLETE, GAME_VARIANT_BLITZKRIEG, GAME_VARIANT_POWER } from '../store';
import { checkLastPlayerQuit } from '../../utilities/game';

export const SET_VARIANT = 'SET_VARIANT';
export const SET_TOTAL_SHOT = 'SET_TOTAL_SHOT';
export const START_GAME = 'START_GAME';
export const STOP_GAME = 'STOP_GAME';
export const UPDATE_GAME_DATA = 'UPDATE_GAME_DATA';
export const UPDATE_GAME_IMAGE = 'UPDATE_GAME_IMAGE';
export const PLAYER_ADD = 'PLAYER_ADD';
export const PLAYER_REMOVE = 'PLAYER_REMOVE';
export const PLAYER_TOGGLE = 'PLAYER_TOGGLE';
export const PLAYER_QUIT = 'PLAYER_QUIT';

const game = (currentState = null, action) => {
    switch (action.type) {
        case SET_VARIANT:
            {
                switch (action.variant) {
                    case GAME_VARIANT_BLITZKRIEG:
                        return { ...currentState, variant: action.variant, totalShot: 60 }
                    case GAME_VARIANT_POWER:
                        return { ...currentState, variant: action.variant, totalShot: 30 }
                    default:
                        return { ...currentState, variant: action.variant, totalShot: 60 }
                }
            }
        case SET_TOTAL_SHOT:
            return { ...currentState, totalShot: action.totalShot }
        case START_GAME:
            return { ...currentState, state: GAME_STATE_IN_PROGRESS }
        case STOP_GAME:
            return { ...currentState, state: GAME_STATE_COMPLETE }
        case UPDATE_GAME_DATA:
            return { ...currentState, currentTime: action.currentTime, currentShot: action.currentShot }
        case UPDATE_GAME_IMAGE:
            return { ...currentState, currentImageUrl: action.imageUrl }
        case PLAYER_ADD:
            {
                const newPlayer = { id: Date.now().toFixed() * Math.random(), name: action.name, selected: true, lastShot: -1 }
                const newPlayers = [...currentState.players];
                newPlayers.push(newPlayer);
                return { ...currentState, players: newPlayers }
            }
        case PLAYER_REMOVE:
            {
                const newPlayers = currentState.players.filter(item => item.id !== action.playerId);
                return { ...currentState, players: newPlayers }
            }
        case PLAYER_TOGGLE:
            {
                // Map new array
                const newPlayers = currentState.players.map(
                    (item, index) => item.id === action.playerId ? 
                        {...item, selected: !item.selected } :
                        item
                    );

                return { ...currentState, players: newPlayers }
            }
        case PLAYER_QUIT:
            {
                // Map new array
                const newPlayers = currentState.players.map(
                    (item, index) => item.id === action.playerId ? 
                        {...item, lastShot: (currentState.currentShot || 0)} : 
                        item
                    );
                
                // Check if we need to stop game
                const { newState, newImageUrl } = checkLastPlayerQuit(currentState, newPlayers);

                return { ...currentState, players: newPlayers, state: newState, currentImageUrl: newImageUrl }
            }
        default:
            return currentState;
    }
}

export default game;