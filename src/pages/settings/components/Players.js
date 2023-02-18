import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { sortPlayers } from '../../../utilities/sort';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { PLAYER_ADD, PLAYER_TOGGLE, PLAYER_REMOVE } from '../../../store/reducers/game';

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 2,
        paddingTop: '75px',
        paddingRight: '15px'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 400
    },
    listRoot: {
        marginTop: '35px',
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    selected: {
    },
    notSelected: {
        textDecoration: 'line-through',
        color: theme.palette.secondary.dark,
    },
    addRoot: {
        marginTop: '35px',
        paddingLeft: '15px',
        marginBottom: '100px'
    }
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            players: "Players",
            optional: "Optional",
            add: "Add a player",
        },
        fr: {
            players: "Joueurs",
            optional: "Optionnel",
            add: "Ajouter un joueur",
        }
    }
);

const ListPlayers = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const gamePlayers = useSelector(s => s.game.players) || [];
    gamePlayers.sort(sortPlayers);

    if (gamePlayers.length === 0) {
        return (null);
    }

    return (
        <List className={classes.listRoot}>
            {gamePlayers.map((item) => {
                return (
                    <ListItem key={item.id} dense button className={item.selected ? classes.selected : classes.notSelected} 
                        onClick={() => dispatch({ type: PLAYER_TOGGLE, playerId: item.id })}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={item.selected}
                                tabIndex={-1}
                                disableRipple
                            />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => dispatch({ type: PLAYER_REMOVE, playerId: item.id })}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
}

const AddPlayer = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const addPlayerFunc = () => { dispatch({ type: PLAYER_ADD, name: document.getElementById('add').value }); document.getElementById('add').value = ''; }

    return (
        <div className={classes.addRoot}>
            <TextField id="add" label={translations.add} inputProps={{maxLength: 20}} 
                onKeyPress={(event) => {if (event.charCode === 13) { event.preventDefault(); addPlayerFunc(); }}}
            />
            <IconButton edge="end" onClick={addPlayerFunc}>
                <AddIcon />
            </IconButton>
        </div>
    );
}

const _DEFAULT = () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    
    return (
        <div className={classes.root}>
            <Typography className={classes.title}>
                {translations.players}
            </Typography>
            <Typography>
                {translations.optional}
            </Typography>

            <ListPlayers />
            <AddPlayer />
            
        </div>
    );
}

export default _DEFAULT;