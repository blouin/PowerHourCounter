import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../Header';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import HistoryIcon from '@material-ui/icons/History';

const ButtonHome = () => {
    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/" >
            <HomeIcon />
        </IconButton>
    );
}

const ButtonHistory = () => {   
    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/history">
            <HistoryIcon />
        </IconButton>
    );
}

const _DEFAULT = () => {
    return (
        <Header tooltip={true}>
            <ButtonHistory />
            <ButtonHome />
        </Header>
    );
}

export default _DEFAULT;