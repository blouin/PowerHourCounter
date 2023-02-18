export const SET_THEME = 'SET_THEME';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_SOUND = 'SET_SOUND';
export const SET_UPDATE = 'SET_UPDATE';

const ui = (currentState = null, action) => {
  switch (action.type) {
    case SET_THEME:
      return { ...currentState, theme: action.theme }
    case SET_LANGUAGE:
      return { ...currentState, language: action.language }
    case SET_SOUND:
      return { ...currentState, sound: action.sound }
      case SET_UPDATE:
        return { ...currentState, update: action.update }
    default:
      return currentState;
  }
}

export default ui;