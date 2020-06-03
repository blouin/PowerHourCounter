import React from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { GAME_STATE_READY, INSTRUCTION_IMAGE_HACK } from '../../../store/store';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 3,
        padding: '15px',
        height: '100%',
        width: '100%',
        paddingTop: '75px',
        overflow: 'hidden',
        transition: 'flex 0.5s linear',
        position: 'relative'
    },
    hidden: {
        flex: 0.000001,
        height: '0px',
        overflow: 'hidden',
    },
    title: {
        fontWeight: 500
    },
    smallInstruction: {
        fontSize: '70%',
        transition: 'font-size 0.25s linear'
    },
    content: {
        width: '85%',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%) translateX(-50%)',
        left: '50%'
    },
    social: {
        textAlign: 'right'
    },
    pictureFrame: {
        width: '100%', 
        height: '100%',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transition: 'background 0.25s linear'
    }
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            instructionsTitle: "Instructions:",
            instructionsLine1a: "Recommended: ",
            instructionsLine1b: "In ",
            instructionsLine1c: "game settings",
            instructionsLine1d: ", select photos and add players.",
            instructionsLine2: "Press Start to begin.",
            instructionsLine3: "When the timer reaches zero (every minute), take a shot.",
            instructionsLine4: "If a person quits, open panel on the side to remove them from the list.",
            instructionsLine5: "The game stops after {0} shots.",
            cancel: "No player!!"
        },
        fr: {
            instructionsTitle: "Instructions:",
            instructionsLine1a: "Recommandé: ",
            instructionsLine1b: "Dans les ",
            instructionsLine1c: "réglages",
            instructionsLine1d: ", choisissez des photos et ajoutez des joueurs.",
            instructionsLine2: "Appuyez sur Débuter pour commencer à jouer.",
            instructionsLine3: "À chaque fois que le compteur arrive à zéro (chaque minute), prennez un shooter.",
            instructionsLine4: "Si un joueur abandonne, ouvrir le panneau sur le côté pour l'enlever de la liste.",
            instructionsLine5: "Le jeu termine après {0} shooters.",
            cancel: "Aucun participant!!"
        }
    }
);

export default () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const matchesHide = useMediaQuery('(min-width:400px)');
    const matchesSmall = useMediaQuery('(max-width:600px)');
    const gamePlayers = useSelector(s => s.game.players) || [];
    const filteredPlayers = gamePlayers.filter(item => item.selected);
    const gameIsReady = useSelector(s => s.game.state) === GAME_STATE_READY;
    const gameImageUrl = useSelector(s => s.game.currentImageUrl) || '';
    const totalShot = useSelector(s => s.game.totalShot);
    const hidden = (gameImageUrl || '') === '' ? classes.hidden : '';
    const small = matchesSmall ? classes.smallInstruction : '';

    // Hide if screen size too small
    if (!matchesHide) {
        return (null);
    }

    // If game not started (display instruction)
    if (gameIsReady || gameImageUrl === INSTRUCTION_IMAGE_HACK) {
        return (
            <div className={classes.root}>
                <Card className={`${classes.content} ${small}`}>
                    <CardContent>
                        <Typography className={classes.title}>{translations.instructionsTitle}</Typography>
                        <ul>
                            <li>
                                <b>{translations.instructionsLine1a}</b>
                                {translations.instructionsLine1b}
                                <b><Link component={RouterLink} to="/settings">{translations.instructionsLine1c}</Link></b>
                                {translations.instructionsLine1d}
                            </li>
                            <li>{translations.instructionsLine2}</li>
                            <li>{translations.instructionsLine3}</li>
                            {filteredPlayers.length !== 0 && <li>{translations.instructionsLine4}</li>}
                            <li>{translations.formatString(translations.instructionsLine5, totalShot)}</li>
                        </ul>
                        <div className={`${classes.social} social-wrapper`}>
                            <div
                                class="fb-like"
                                data-href="https://facebook.com/powerhourcounter" 
                                data-width="" 
                                data-layout="button"
                                data-action="like" 
                                data-size="small" 
                                data-share="true">
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // In game (display current image)
    return (
        <div className={`${classes.root} ${hidden}`}>
            <div className={classes.pictureFrame} style={{backgroundImage: `url(${gameImageUrl})`}} />
        </div>
    );
};