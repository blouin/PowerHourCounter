import ReactGA from 'react-ga';

export const initLog = () => {
    const sessionId = parseInt(Date.now().toFixed() * Math.random());
    ReactGA.initialize('UA-165926552-1', 
        { 
            gaOptions: { userId: sessionId }, 
            debug: process.env.NODE_ENV === "development", 
            testMode: process.env.NODE_ENV === "development", 
        }
    );
    
}

export const logPageView = (pageName) => {
    ReactGA.set({ page: pageName });
    ReactGA.pageview(pageName);
}

export const logModalView = (modalName) => {
    ReactGA.modalview(modalName);
}

export const logLanguage = (language, nextUrl) => {
    ReactGA.event({ category: 'Settings', action: 'Language', label: JSON.stringify({ language, nextUrl }) });
}

export const logGameStart = (variant, totalShot, hasPlayers, hasPhotos) => {
    ReactGA.event({ category: 'Game', action: 'Started', label: JSON.stringify({ variant, totalShot, hasPlayers, hasPhotos }) });
}

export const logGameProgress = (currentShot, totalShot) => {
    ReactGA.event({ category: 'Game', action: 'Progress', label: JSON.stringify({ currentShot, totalShot }) });
}

export const logGameEnd = (reason, currentShot, totalShot) => {
    ReactGA.event({ category: 'Game', action: 'Complete', label: JSON.stringify({ reason, currentShot, totalShot }) });
}