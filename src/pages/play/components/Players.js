import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import { sortPlayers } from '../../../utilities/sort';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Drawer from '@material-ui/core/Drawer';
import { GAME_STATE_READY, GAME_STATE_IN_PROGRESS, GAME_STATE_COMPLETE } from '../../../store/store';
import { PLAYER_QUIT } from '../../../store/reducers/game';

const WAIT_BEFORE_CLOSING = 1200;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '240px',
        flex: 2,
        backgroundColor: 'red'
    },
    description: {
        fontSize: '95%',
        paddingBottom: '5px'
    },
    drawerPaper: {
        width: '300px',
        backgroundColor: theme.palette.secondary.light,
        paddingTop: '75px',
        paddingLeft: '5px',
        paddingRight: '5px'
    },
    drawerContent: {
        overflowY: 'auto',
        height: '100%',
        padding: '5px'
    },
    title: {
        fontWeight: 500,
    },
    playerItem: {
        borderRadius: '10px',
        padding: '10px',
        marginTop: '10px',
        flexDirection: 'column',
        width: '100%',
        minHeight: '60px',
    },
    green: {
        border: 'solid 2px green',
        background: 'rgba(0, 255, 0, .10)',
        '&:hover': {
            background: 'rgba(0, 255, 0, .15)',
            cursor: 'pointer',
            color: theme.palette.secondary.dark,
         }
    },
    red: {
        border: 'solid 2px rgba(255, 0, 0, .45)',
        background: 'rgba(255, 0, 0, .10) !important'
    },
    playerItemName: {
        textAlign: 'left',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        width: '200px'
    },
    playerItemInfo: {
        textAlign: 'left',
        fontSize: '75%',
        fontStyle: 'italic',
        width: '200px'
    }
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            title: "List of players:",
            description1: "Green players are still active.",
            description2: "Red players have quit.",
            //description3: "Press on a green player to remove them.",
            description3: "Press on a green player to remove them if they quit.",
            redFormat: "Stopped after {0} shots",
            greenFormat: "Still drinking",
            greenFormatReady: "Ready to drink",
            greenFormatDone: "Completed"

        },
        fr: {
            title: "Liste de joueurs",
            description1: "Les joueurs en vert sont toujours en jeu.",
            description2: "Les joueurs en rouge ont abandonnés.",
            //description3: "Appuyez sur un joueur en vert pour l'enlever du jeu.",
            description3: "Appuyez sur un joueur en vert s'il abandonne.",
            redFormat: "A abandonné après {0} shooters",
            greenFormat: "Boit toujours",
            greenFormatReady: "Pret à boire",
            greenFormatDone: "A reussi"
        }
    }
);

const PlayerItem = (props) => {
    const item = props.item;
    const setOpen = props.setOpen;
    const classes = useStyles();
    const dispatch = useDispatch();
    const gameInProgress = useSelector(s => s.game.state) === GAME_STATE_IN_PROGRESS;

    // Set classes
    const className = item.lastShot === -1 ? classes.green : classes.red;
    const disabled = item.lastShot === -1 && gameInProgress ? false : true;

    // Click function
    let clickFunc = () => { dispatch({ type: PLAYER_QUIT, playerId: item.id }); setTimeout(() => setOpen(false), WAIT_BEFORE_CLOSING) }
    if (item.lastShot !== -1 || !gameInProgress) { clickFunc = null; }

    return (
        <ButtonBase variant="contained" className={`${classes.playerItem} ${className}`} onClick={clickFunc} disabled={disabled}>
            <div className={classes.playerItemName}>{item.name}</div>
            <PlayerItemLastShot item={item} />
        </ButtonBase>
    );
}

const PlayerItemLastShot = (props) => {
    const item = props.item;
    const classes = useStyles();
    const gameReady = useSelector(s => s.game.state) === GAME_STATE_READY;
    const gameComplete = useSelector(s => s.game.state) === GAME_STATE_COMPLETE;
    const greenText = gameReady ? translations.greenFormatReady : (gameComplete ? translations.greenFormatDone : translations.greenFormat);
    
    if (item.lastShot !== -1) {
        return (
            <div className={classes.playerItemInfo}>
                {translations.formatString(translations.redFormat, item.lastShot)}
            </div>
        );
    }

    return (
        <div className={classes.playerItemInfo}>
            {greenText}
        </div>
    );
}

export default (props) => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const { open, setOpen } = props;
    const gamePlayers = useSelector(s => s.game.players) || [];
    gamePlayers.sort(sortPlayers);
    const filteredPlayers = gamePlayers.filter(item => item.selected);

    let opened = open;
    if (filteredPlayers.length === 0) {
        opened = false;
    }

    return (
        <Drawer variant="persistent" anchor="right" open={opened} className={classes.root} classes={{ paper: classes.drawerPaper }}>
            <div className={classes.drawerContent}>
                <Typography className={classes.title}>
                    {translations.title}
                </Typography>
                {/*
                <ul>
                    <li><Typography className={classes.description}>{translations.description1}</Typography></li>
                    <li><Typography className={classes.description}>{translations.description2}</Typography></li>
                </ul>
                */}
                <Typography className={classes.description}>
                    {translations.description3}
                </Typography>

                {filteredPlayers.map((item) => <PlayerItem key={item.id} item={item} setOpen={setOpen} />)}
            </div>
        </Drawer>
    );
};