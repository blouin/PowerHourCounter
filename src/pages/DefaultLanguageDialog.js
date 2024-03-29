import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import { LANGUAGE_DEFAULT } from '../store/store';
import { SET_LANGUAGE } from '../store/reducers/ui';

const useStyles = makeStyles((theme) => ({
    actions: {
        display: 'flex',
        width: '100%',
        alignItems: 'stretch',
    },
    divider: {
        marginLeft: '5px',
        marginRight: '5px'
    },
    language: {
        padding: '10px',
        textAlign: 'center',
        flex: 1
    }
  })
);

const _DEFAULT = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const open = useSelector(s => s.ui.language) === LANGUAGE_DEFAULT;

    return (
        <Dialog fullWidth disableEscapeKeyDown={false} open={open}>
            <DialogTitle>{process.env.REACT_APP_DESCRIPTION}</DialogTitle>
            <DialogContent>
                <div className={classes.actions}>
                    <div className={classes.language}>
                        60 shots.
                        <br />
                        60 minutes.
                        <br />
                        <br />
                        <Button variant="contained" color="primary" onClick={() => { dispatch({ type: SET_LANGUAGE, language: 'en' }); }}>View in<br />English</Button>
                        <br />
                        <br />
                        <Button variant="text" color="primary" onClick={() => { dispatch({ type: SET_LANGUAGE, language: 'en' }); }} component={RouterLink} to="/settings">Update<br />settings</Button>
                    </div>
                    <Divider orientation="vertical" flexItem className={classes.divider} />
                    <div className={classes.language}>
                        60 shooters.
                        <br />
                        60 minutes.
                        <br />
                        <br />
                        <Button variant="contained" color="primary" onClick={() => { dispatch({ type: SET_LANGUAGE, language: 'fr' }); }}>Voir en<br />français</Button>
                        <br />
                        <br />
                        <Button variant="text" color="primary" onClick={() => { dispatch({ type: SET_LANGUAGE, language: 'fr' }); }} component={RouterLink} to="/settings">Modifier<br />réglages</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default _DEFAULT;