import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Header from './components/Header';
import Options from './components/Options';
import Players from './components/Players';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        marginTop: '15px',
        marginLeft: '15px'
    }
  })
);

export default () => {
    const classes = useStyles();

    return (
        <>
            <Header />
            <div className={classes.root}>
                <Options />
                <Players />
            </div>
        </>
    );
};