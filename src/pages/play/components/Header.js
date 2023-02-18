import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../Header';
import Players from './Players';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import VolumeUp from '@material-ui/icons/VolumeUp';
import VolumeOff from '@material-ui/icons/VolumeOff';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
import { GAME_STATE_IN_PROGRESS, GAME_STATE_READY } from '../../../store/store';
import { SET_SOUND } from '../../../store/reducers/ui';
import InformationDialog from '../../InformationDialog'; // TODO: Maybe move to base header?

const ButtonDownload = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton edge="start" color="inherit" onClick={() => { setOpen(true)} }>
                <InfoOutlinedIcon />
            </IconButton>
            <InformationDialog open={open} setOpen={setOpen} />
        </>
    );
}

const ButtonHistory = () => {
    const gameInProgress = useSelector(s => s.game.state) === GAME_STATE_IN_PROGRESS;

    if (gameInProgress) {
        return (null);
    }

    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/history">
            <HistoryIcon />
        </IconButton>
    );
}

const ButtonSound = () => {
    const dispatch = useDispatch();
    const sound = useSelector(s => s.ui.sound);

    if (sound) {
        return (
            <IconButton edge="start" color="inherit" onClick={() => dispatch({ type: SET_SOUND, sound: false })}>
                <VolumeUp />
            </IconButton>
        );
    }
    else {
        return (
            <IconButton edge="start" color="inherit" onClick={() => dispatch({ type: SET_SOUND, sound: true })}>
                <VolumeOff />
            </IconButton>
        );
    }
}

const ButtonSettings = () => {
    const gameIsReady = useSelector(s => s.game.state) === GAME_STATE_READY;

    if (!gameIsReady) {
        return (null);
    }

    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/settings">
            <SettingsIcon />
        </IconButton>
    );
}

const ButtonDrawer = (props) => {
    const { open, setOpen } = props;
    const gamePlayers = useSelector(s => s.game.players) || [];
    const filteredPlayers = gamePlayers.filter(item => item.selected);

    if (filteredPlayers.length === 0) {
        return (null);
    }

    return (
        <>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(!open)}>
                <MenuIcon />
            </IconButton>
        </>
    );
}

const _DEFAULT = () => {
    const [playersOpen, setPlayersOpen] = useState(false);
    return (
        <>
            <Header>
                <ButtonDownload />
                <ButtonHistory />
                <ButtonSound />
                <ButtonSettings />
                <ButtonDrawer open={playersOpen} setOpen={setPlayersOpen} />
            </Header>
            <Players open={playersOpen} setOpen={setPlayersOpen} />
        </>
    );
}

export default _DEFAULT;