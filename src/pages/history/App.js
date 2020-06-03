import React, { useState } from "react";
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Header from './components/Header';
import ConfirmDialog from '../ConfirmDialog';
import { makeStyles } from '@material-ui/core/styles';
import { loadHistory, removeHistory } from '../../utilities/storage';
import { sortPlayers, sortHistory } from '../../utilities/sort';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: '75px',
        paddingLeft: '25px',
        paddingRight: '25px',
        textAlign: 'center'
    },
    smallItem: {
        paddingTop: '0px',
        paddingBottom: '0px'
    }
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            none: "No history",
            total: "Total minutes: {0}",
            players: "Players:",
            playersNone: "N/A",
            playerDoneTotal: "   (Only completed {0} out of {1} minutes)",
            deleteTitle: "Clear history item",
            deleteConfirm: "Do you really want to remove this entry from history?",
        },
        fr: {
            none: "Aucun historique",
            total: "Minutes total: {0}",
            players: "Joueurs:",
            playersNone: "N/A",
            playerDoneTotal: "   (A seulement fait {0} des {1} minutes)",
            deleteTitle: "Effacer l'item de l'historique",
            deleteConfirm: "Voulez vous vraiement effacer l'item de l'historique?",
        }
    }
);

const None = (props) => {
    const history = props.history;

    if (history.length !== 0) {
        return (null);
    }

    return (
        <Typography>{translations.none}</Typography>
    );
}

const HistoryItem = (props) => {
    const item = props.item;
    const [open, setOpen] = useState(false);
    const deleteFunction = () => { props.setHistory(removeHistory(item.id)) };

    return (
        <>
            <ListItem>
                <ListItemText
                    primary={item.date}
                    secondary={
                        <>
                            <Typography>
                                {translations.formatString(translations.total, item.totalShot)}
                            </Typography>

                            <Typography>
                                {translations.players}
                            </Typography>
                            <HistoryItemPlayers item={item} totalShot={item.totalShot} />
                        </>
                    } />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                        <DeleteIcon />
                    </IconButton>
                    <ConfirmDialog
                        title={translations.deleteTitle}
                        open={open}
                        setOpen={setOpen}
                        onConfirm={deleteFunction}>
                        {translations.deleteConfirm}
                    </ConfirmDialog>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </>
    );
}

const HistoryItemPlayers = (props) => {
    const classes = useStyles();
    const item = props.item;
    const players = item.players || [];
    players.sort(sortPlayers);

    if (players.length === 0) {
        return translations.playersNone;
    }

    return (
        <List>
            {players.map((item, index) => (
                <ListItem className={classes.smallItem}>
                    {item.name}
                    {item.lastShot === -1 ? '' : translations.formatString(translations.playerDoneTotal, item.lastShot, props.totalShot)}
                </ListItem>
            ))}
        </List>
    );
};

export default () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const [history, setHistory] = useState(loadHistory() || []);
    history.sort(sortHistory)

    return (
        <>
            <Header history={history} />
            <List className={classes.root}>
                <None history={history} />
                {history.map((item, index) => <HistoryItem key={index} item={item} setHistory={setHistory} />)}
            </List>
        </>
    );
};