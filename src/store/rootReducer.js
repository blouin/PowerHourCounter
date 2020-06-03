import { combineReducers } from 'redux';
import game from './reducers/game';
import ui from './reducers/ui';
import photos from './reducers/photos';

export default combineReducers({
    game,
    ui,
    photos
});