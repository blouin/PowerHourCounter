import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { GAME_STATE_READY, GAME_STATE_COMPLETE } from '../../../store/store';
import { START_GAME } from '../../../store/reducers/game';
import { logGameStart } from '../../../utilities/analytics';

const YELLOW = "#ffc400";
const RED = "#ff3d00";

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 2,
        padding: '15px',
        height: '100%',
        width: '100%',
        paddingTop: '75px',
        overflow: 'hidden',
        textAlign: 'center'
    },
    content: {
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    time: {
        fontWeight: 'bold',
        fontSize: '6rem',
        lineHeight: '1.167',
        letterSpacing: '-0.01562em',
    },
    count: {
        fontSize: '2.125rem',
        lineHeight: '1.235',
        letterSpacing: '0.00735em',
    },
    startButton: {
        marginTop: '25px',
    },
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            done: "Done",
            countFormat: "{0} of {1}",
            startButton: "Start"
        },
        fr: {
            done: "Terminé",
            countFormat: "{0} de {1}",
            startButton: "Débuter"
        }
    }
);

const StartButton = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const variant = useSelector(s => s.game.variant);
    const totalShot = useSelector(s => s.game.totalShot);
    const hasPlayers = useSelector(s => s.game.players.length !== 0);
    const hasPhotos = useSelector(s => s.photos.files.length !== 0); // Will be removed at some point, for now, simply log if photo picker is working
    const gameIsReady = useSelector(s => s.game.state) === GAME_STATE_READY;

    return (
        <div className={classes.startButton}>
            {gameIsReady && <Button variant="contained" color="primary" size="large" 
                onClick={() => {
                    logGameStart(variant, totalShot, hasPlayers, hasPhotos);
                    dispatch({ type: START_GAME })
                }}>{translations.startButton}</Button>}
        </div>
    );
}

export default () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const currentTime = useSelector(s => s.game.currentTime);
    const currentShot = useSelector(s => s.game.currentShot);
    const totalShot = useSelector(s => s.game.totalShot);
    const gameHasEnded = useSelector(s => s.game.state) === GAME_STATE_COMPLETE;
    const color = !gameHasEnded && currentTime < 2 ? RED : (!gameHasEnded && currentTime < 4 ? YELLOW  : '');

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <Typography className={classes.time} style={{color: color}}>
                    {gameHasEnded ? "-" : currentTime}
                </Typography>
                <Typography className={classes.count}>
                    {translations.formatString(translations.countFormat, currentShot, totalShot)}
                </Typography>
                <StartButton />
            </div>
        </div>
    );
};