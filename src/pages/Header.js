import React from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { getFlagValue, FLAG_TOOLTIP_VERSION } from '../utilities/devflags';
import { GAME_VARIANT_BLITZKRIEG, GAME_VARIANT_POWER } from '../store/store'; 

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 1,
    },
    title: {
        flexGrow: 1,
        fontSize: '1.25rem',
        fontWeight: 500
    }
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            title: "Power Hour Counter",
            demiTitle: "Power Half Hour Counter",
            centurionTitle: "Centurion Counter",
            blitzkriegTitle: "Blitzkrieg Hour Counter",
            powerTitle: "Super-Power Half Hour Counter",
        },
        fr: {
            title: "Happy Hour Counter",
            demiTitle: "Demi-Happy Hour Counter",
            centurionTitle: "Centurion Counter",
            blitzkriegTitle: "Blitzkrieg Power Hour Counter",
            powerTitle: "Super-Power Half Hour Counter",
        }
    }
);

const _DEFAULT = (props) => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const variant = useSelector(s => s.game.variant);
    const totalShot = useSelector(s => s.game.totalShot);
    const tooltipTitle = props.tooltip && getFlagValue(FLAG_TOOLTIP_VERSION) ? process.env.REACT_APP_VERSION : '';
    const actualTitle =
        variant === GAME_VARIANT_BLITZKRIEG ? translations.blitzkriegTitle :
            (variant === GAME_VARIANT_POWER ? translations.powerTitle :
                (totalShot === 100 ? translations.centurionTitle : (totalShot === 30 ? translations.demiTitle : translations.title)));

    return (
        <>
            <AppBar position="fixed" className={classes.root}>
                <Toolbar>
                    <Tooltip title={tooltipTitle} placement="bottom-start" disabled>
                        <Typography variant="h1" className={classes.title}>
                            {actualTitle}
                        </Typography>
                    </Tooltip>
                    {props.children}
                </Toolbar>
            </AppBar>
        </>
    );
}

export default _DEFAULT;