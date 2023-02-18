export const SET_FOLDER = 'SET_FOLDER';
export const SET_STATE = 'SET_STATE';
export const SET_FILES = 'SET_FILES';

const ui = (currentState = null, action) => {
  switch (action.type) {
    case SET_FOLDER:
        return { ...currentState, folder: action.folder }
    case SET_STATE:
        return { ...currentState, state: action.state }
    case SET_FILES:
        return { ...currentState, files: action.files }
    default:
        return currentState;
  }
}

export default ui;