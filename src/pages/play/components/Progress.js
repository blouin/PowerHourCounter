import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { GAME_STATE_COMPLETE } from '../../../store/store';
import * as shotFull from '../../../assets/shot-full.png';
import * as shotEmpty from '../../../assets/shot-empty.png';
import * as beer from '../../../assets/beer.png';
import * as beerLoad from '../../../assets/beer-load.png';
import * as beerCA from '../../../assets/beer-ca.png';
import * as beerDE from '../../../assets/beer-de.png';

const SHOTS_IN_BEER = 11;
const LOADING_BEER = 'DEFAULT';
const COUNTRY_URL = "https://ipapi.co/json";
// http://ip-api.com/json

const beerImages = {
    DEFAULT: beerLoad,
    CA: beerCA,
    DE: beerDE
}

const useStyles = makeStyles((theme) => ({
    progressWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        height: '100%',
        justifyContent: 'space-around',
    },
    progressTodoWrapper: {
        marginLeft: '25px',
        fontWeight: 500
    },
    progressRowWrapper: {
        flex: 1,
        textAlign: 'center',
        display: 'flex',
        height: '100%',
        marginLeft: '50px',
        marginRight: '50px'
    },
    progressRowItem: {
        flex: 1,
        width: '60px',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        textAlign: 'center',
        height: '100%',
    },
    progressRowItemTransition: {
        transition: 'background 0.5s linear',
    },
  })
);

let translations = new LocalizedStrings(
    {
        en: {
            remaining: "Left to drink:",
            share: "Please share. Thanks!"
        },
        fr: {
            remaining: "Il reste à boire:",
            share: "SVP partager. Merci!"
        }
    }
);

// Shots logic
const Shots = (props) => {
    const toDisplay = props.toDisplay;
    const totalBeers = props.totalBeers;
    const currentShot = useSelector(s => s.game.currentShot);
    const totalShot = useSelector(s => s.game.totalShot);

    let shots = [];
    let showUntil = (currentShot % SHOTS_IN_BEER);
    let showMax = toDisplay;
    if (parseInt(currentShot / SHOTS_IN_BEER) === totalBeers) {
        showMax = totalShot - (totalBeers * SHOTS_IN_BEER);
    }

    for (let shot = 0; shot < toDisplay; shot++) {
        shots.push(<ShotItem key={shot} show={shot >= showUntil && shot < showMax} />)
    }
    return shots;
}
const ShotItem = (props) => {
    const classes = useStyles();
    const show = props.show;
    const imageUrl = show ? shotFull : shotEmpty;

    return <div className={`${classes.progressRowItem} ${classes.progressRowItemTransition}`} style={{backgroundImage: `url(${imageUrl})`}} />;
}

// Beers logic
const Beers = (props) => {
    const toDisplay = props.toDisplay;
    const currentShot = useSelector(s => s.game.currentShot);

    let beers = [];
    let showUntil = parseInt(currentShot / SHOTS_IN_BEER);
    for (let beer = toDisplay - 1; beer >= 0; beer--) {
        beers.push(<BeerItem key={beer} show={beer >= showUntil} country={props.country} />)
    }
    return beers;
}
const BeerItem = (props) => {
    const classes = useStyles();
    const show = props.show;

    const imageUrl = beerImages[props.country] ?? beer;
    const visibilityValue = show ? '' : 'hidden';
    return <div className={`${classes.progressRowItem}`} style={{ backgroundImage: `url(${imageUrl})`, visibility: visibilityValue }} />;
}

export default () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const totalShot = useSelector(s => s.game.totalShot);
    const totalBeers = Math.max(Math.floor(totalShot / SHOTS_IN_BEER), 0); // OK to "floor", since there is a row of shooters
    const gameHasEnded = useSelector(s => s.game.state) === GAME_STATE_COMPLETE;
    
    // Get country
    const [country, setCountry] = useState(LOADING_BEER);
    useEffect(() => {
        fetch(COUNTRY_URL)
            .then(response => response.json())
            //.then(data => console.log(data.country_code))
            .then(data => setCountry(data.country_code))
            .catch(e => { console.log(e); setCountry('') })
    }, [])

    // Hide if done
    if (gameHasEnded) {
        return (null);
    }

    return (
        <div className={classes.progressWrapper}>
            <Typography className={classes.progressTodoWrapper}>
                {translations.remaining}
            </Typography>
            <div style={{flex: 1}} className={classes.progressRowWrapper}>
                <Shots totalBeers={totalBeers} toDisplay={Math.min(SHOTS_IN_BEER, totalShot)} />
            </div>
            <div style={{ flex: 3 }} className={classes.progressRowWrapper}>
                <Beers toDisplay={totalBeers} country={country} />
            </div>
        </div>
    );
};