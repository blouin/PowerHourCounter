import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../../Header';
import ConfirmDialog from '../../ConfirmDialog';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import { clearHistory } from '../../../utilities/storage';

let translations = new LocalizedStrings(
    {
        en: {
            title: "Clear history",
            confirm: "Do you really want to clear ALL history?",
        },
        fr: {
            title: "Effacer l'historique",
            confirm: "Voulez vous vraiement effacer TOUTE l'historique?",
        }
    }
);

const ButtonClear = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton edge="start" color="inherit" onClick={() => setOpen(true)}>
                <DeleteIcon />
            </IconButton>
            <ConfirmDialog
                title={translations.title}
                open={open}
                setOpen={setOpen}
                onConfirm={() => { clearHistory(); window.location.reload(false); }}>
                {translations.confirm}
            </ConfirmDialog>
        </>
    );
}

const ButtonSettings = () => {
    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/settings">
            <SettingsIcon />
        </IconButton>
    );
}

const ButtonHome = () => {
    return (
        <IconButton edge="start" color="inherit" component={RouterLink} to="/" >
            <HomeIcon />
        </IconButton>
    );
}

export default (props) => {
    translations.setLanguage(useSelector(s => s.ui.language));

    return (
        <Header>
            {props.history.length !== 0 && <ButtonClear />}
            <ButtonSettings />
            <ButtonHome />
        </Header>
    );
}
