import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import PhotosBrowse from './PhotosBrowse';
import PhotosUpload from './PhotosUpload';
import { SET_TOTAL_SHOT, SET_VARIANT } from '../../../store/reducers/game';
import { SET_THEME, SET_LANGUAGE, SET_SOUND } from '../../../store/reducers/ui';
import { isElectron } from '../../../utilities/electron';
import { GAME_VARIANT_CLASSIC, GAME_VARIANT_BLITZKRIEG, GAME_VARIANT_POWER } from '../../../store/store'; 

const MIN_SHOT_DEV = 5;
const MIN_SHOT = 30;
const MAX_SHOT = 100;
const STEP_DEV = 5;
const STEP = 10;

const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        paddingTop: '75px',
        paddingLeft: '15px',
        paddingRight: '20px'
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 400
    },
    variantItemCombo: {
        padding: '5px',
        width: '100%'
    },
    variantDescription: {
        paddingLeft: '5px',
        fontSize: '95%',
    },
    minutesOptionGroup: {
        paddingLeft: '10px',
        marginTop: '15px',
        fontSize: '95%',
        fontWeight: 'bold'
    },
    minutesOptionItem: {
        marginTop: '50px',
        marginLeft: '25px',
        marginRight: '25px'
    },
    photosOptionGroup: {
        marginTop: '25px',
    },
    photosOptionButton: {
        margin: '15px',
    },
    photosOptionText: {
        marginLeft: '15px',
        fontSize: '85%',
    },
    extraOptionGroup: {
        marginTop: '25px',
        flexDirection: 'column',
        marginBottom: '100px'
    },
    extraOptionGroupItem: {
        flex: 1
    },
    extraOptionGroupItemCombo: {
        margin: '3px',
        padding: '10px',
        width: '100%'
    },
    warningGroup: {
        bottom: '0',
        left: '0',
        width: '100%',
        position: 'fixed',
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.modal - 1,
        paddingLeft: '10px',
        paddingBottom: '10px'
    },
    dropZoneDialog: {
        overflowX: 'hidden',
    },
    dropzoneClass: {
        minHeight: '100px',
        marginBottom: '15px',
        padding: '5px',
        backgroundColor: theme.palette.secondary.light
    },
    dropzoneParagraphClass: {
        fontSize: '85%',
        paddingLeft: '50px',
        paddingRight: '50px'
    },
    dropzoneProgress: {
        marginBottom: '15px'
    }
  })
);

const marks = [
    {
      value: 30,
      label: '30',
    },
    {
      value: 60,
      label: '60',
    },
    {
      value: 100,
      label: '100',
    }
];

let translations = new LocalizedStrings(
    {
        en: {
            variant: "Game type",
            classic: "Classic",
            blitzkrieg: "Blitzkrieg",
            power: "Super-Power Half Hour",
            classicDesc: "A shot every minute.",
            blitzkriegDesc: "Each minute lasts one second less. 60 shots total.",
            powerDesc: "30 shots of 30 secondes.",
            minutes: "Total minutes:",
            photos: "Photo folder",
            optional: "Optional",
            filesChooseFolder: "Select a folder",
            filesChooseOnline: "Add photos",
            filesCountFolder: "{0} photos found",
            filesCountOnline: "{0} total photos",
            uploadTitle: "Choose images",
            uploadText: "Drag and drop files here or click to select",
            uploadFileLimitExceedMessage:"Maximum of {0} files allowed",
            uploadPreviewText: "Preview",
            uploadCancelText: "Cancel",
            uploadSubmitText: "Submit",
            moreOptions: "More options",
            language: "Language",
            theme: "Theme",
            themeDark: "Dark",
            themeLight: "Light",
            sound: "Sound",
            yes: "Yes",
            no: "No",
            warning1: "Warning:",
            warning2: "This game will get you drunk... Unless you are drinking Coors Light (but that's cheating anyways!).",
        },
        fr: {
            variant: "Type de jeu",
            classic: "Classique",
            blitzkrieg: "Blitzkrieg",
            power: "Super-Power Half Hour",
            classicDesc: "Un shooter à chaque minute.",
            blitzkriegDesc: "Chaque minute à une seconde de moins. 60 shooters total.",
            powerDesc: "30 minutes de 30 secondes.",
            minutes: "Minutes totales:",
            photos: "Photos",
            optional: "Optionnel",
            filesChooseFolder: "Choisir un répertoire",
            filesChooseOnline: "Ajouter des photos",
            filesCountFolder: "{0} photos trouvées",
            filesCountOnline: "{0} photos au total",
            uploadTitle: "Choisir des images",
            uploadText: "Glissez des fichiers ici ou cliquez pour choisir",
            uploadFileLimitExceedMessage:"Maximum de {0} images permises",
            uploadCancelText: "Annuler",
            uploadSubmitText: "Soumettre",
            uploadPreviewText: "Aperçu",
            moreOptions: "Plus d'options",
            language: "Langue",
            theme: "Thème",
            themeDark: "Foncé",
            themeLight: "Clair",
            sound: "Son",
            yes: "Oui",
            no: "Non",
            warning1: "Attention:",
            warning2: "Ce jeu vous rend soul... Sauf si vous buvez de la Coors Light (mais c'est tricher de toute façon!).",
        }
    }
);

// Variant
const Variant = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const variant = useSelector(s => s.game.variant);

    return (
        <div>
            <Typography className={classes.title}>
                {translations.variant}
            </Typography>
            <FormControl className={classes.variantItemCombo}>
                <Select value={variant}
                onClick={(event) => dispatch({ type: SET_VARIANT, variant: event.target.value || variant })}>
                    <MenuItem value='classic'>{translations.classic}</MenuItem>
                    <MenuItem value='blitzkrieg'>{translations.blitzkrieg}</MenuItem>
                    <MenuItem value='power'>{translations.power}</MenuItem>
                </Select>
            </FormControl>
            <Typography className={classes.variantDescription}>
                {variant === GAME_VARIANT_CLASSIC && translations.classicDesc}
                {variant === GAME_VARIANT_BLITZKRIEG && translations.blitzkriegDesc}
                {variant === GAME_VARIANT_POWER && translations.powerDesc}
            </Typography>
        </div>
    );
}

// Minutes
const Minutes = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const totalShot = useSelector(s => s.game.totalShot);
    const variant = useSelector(s => s.game.variant);

    if (variant !== GAME_VARIANT_CLASSIC) {
        return (null);
    }

    return (
        <div className={classes.minutesOptionGroup}>
                {translations.minutes}
            <div className={classes.minutesOptionItem}>
                <Slider
                    onChange={(event, value) => dispatch({ type: SET_TOTAL_SHOT, totalShot: value })}
                    min={props.min}
                    max={MAX_SHOT}
                    value={totalShot}
                    step={props.step}
                    valueLabelDisplay="on"
                    marks={marks}
                />
            </div>
        </div>
    );
}

// Photos
const Photos = () => {
    const classes = useStyles();

    return (
        <div className={classes.photosOptionGroup}>
            <Typography className={classes.title}>
                {translations.photos}
            </Typography>
            <Typography>
                {translations.optional}
            </Typography>
            {isElectron && <PhotosBrowse translations={translations} classes={classes} />}
            {!isElectron && <PhotosUpload translations={translations} classes={classes} />}
        </div>
    );
}

// Sound logic
const SoundDropDown = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const sound = useSelector(s => s.ui.sound);

    const soundInt = sound ? 1 : 0;
    return (
        <FormControl className={classes.extraOptionGroupItemCombo}>
            <InputLabel id="language-select-label">{translations.sound}</InputLabel>
            <Select labelId="language-select-label" value={soundInt}
                onClick={(event) => {let soundBool = parseInt(event.target.value) === 1 ? true : false; dispatch({ type: SET_SOUND, sound: soundBool })} }>
                <MenuItem value="1">{translations.yes}</MenuItem>
                <MenuItem value="0">{translations.no}</MenuItem>
            </Select>
        </FormControl>
    );
}

// Language
const LanguageDropDown = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const language = useSelector(s => s.ui.language);

    return (
        <FormControl className={classes.extraOptionGroupItemCombo}>
            <InputLabel id="language-select-label">{translations.language}</InputLabel>
            <Select labelId="language-select-label" value={language}
                onClick={(event) => dispatch({ type: SET_LANGUAGE, language: event.target.value || language })}>
                <MenuItem value='fr'>Français</MenuItem>
                <MenuItem value='en'>English</MenuItem>
            </Select>
        </FormControl>
    );
}

// Theme
const ThemeDropDown = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useSelector(s => s.ui.theme);

    return (
        <FormControl className={classes.extraOptionGroupItemCombo}>
            <InputLabel id="theme-select-label">{translations.theme}</InputLabel>
            <Select labelId="theme-select-label" value={theme}
                onClick={(event) => dispatch({ type: SET_THEME, theme: event.target.value || theme })}>
                <MenuItem value='light'>{translations.themeLight}</MenuItem>
                <MenuItem value='dark'>{translations.themeDark}</MenuItem>
            </Select>
        </FormControl>
    );
}

const _DEFAULT = () => {
    const classes = useStyles();
    translations.setLanguage(useSelector(s => s.ui.language));
    const min = process.env.NODE_ENV === "development" ? MIN_SHOT_DEV : MIN_SHOT;
    const step = process.env.NODE_ENV === "development" ? STEP_DEV : STEP;

    return (
        <div className={classes.root}>

            <Variant />
            <Minutes min={min} step={step} />
            <Photos />

            <div className={classes.extraOptionGroup}>
                <Accordion variant="elevation">
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{translations.moreOptions}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        <div className={classes.extraOptionGroupItem}>
                            <SoundDropDown />
                            <LanguageDropDown />
                            <ThemeDropDown />
                        </div>

                    </AccordionDetails>
                </Accordion>
            </div>

            <div className={classes.warningGroup}>
                <Typography>
                    <b>{translations.warning1}</b>
                </Typography>
                <Typography style={{ fontSize: '85%' }}>
                    <b>{translations.warning2}</b>
                </Typography>
            </div>
        </div>
    );
}

export default _DEFAULT;