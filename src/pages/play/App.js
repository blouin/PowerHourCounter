import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Header from './components/Header';
import Counter from './components/Counter';
import Image from './components/Image';
import Progress from './components/Progress';
import { useGameClock } from '../../utilities/useGameClock';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100vh',
        justifyContent: 'space-around'
    },
    topWrapper: {
        flex: 1,
        display: 'flex'
    },
    bottomWrapper: {
        flexBasis: '300px'
    },
  })
);

const TopWrapper = () => {
    const classes = useStyles();
    return (
        <div className={classes.topWrapper}>
            <Counter />
            <Image />
        </div>
    );
}

const BottomWrapper = () => {
    const classes = useStyles();
    const matches = useMediaQuery('(min-height:500px)');

    if (!matches) {
        return (null);
    }

    return (
        <div className={classes.bottomWrapper}>
            <Progress />
        </div>
    );
}

export default () => {
    const classes = useStyles();

    // Game clock
    useGameClock();
    
    return (
        <>
            <Header />
            <div className={classes.root}>
                <TopWrapper />
                <BottomWrapper />
            </div>
        </>
    );
}
