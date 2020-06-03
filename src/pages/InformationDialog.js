import React from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const GITHUB_URL = 'https://www.github.com/blouin/PowerHourCounter';
const WIKI_URL = 'https://en.wikipedia.org/wiki/Power_hour';

let translations = new LocalizedStrings(
    {
        en: {
            title: "About",
            description: "PowerHour is a simple drinking game where players must take one shot of beer every minute for an hour, or 60 shots within one hour. This counter allows you to keep track of time.",
            source: "Source code for application available on GitHub. Open any issues for bugs or new feature requests.",
            wikiUrl: "PowerHour on Wikipedia",
            gitHubUrl: "Source on GitHub",
            close: "Close"
        },
        fr: {
            title: "À propos",
            description: "Un HappyHour est jeu où les joueurs doivent prendre un shooter de bière à chaque minute pendant une heure, donc 60 en une heure. Ce compteur permet de garder le décompte.",
            source: "Le code source de l'application est disponible sur GitHub. Vous pouvez aussi déclarer des problèmes ou demander de nouvelles fonctionnalités.",
            wikiUrl: "PowerHour sur Wikipedia (en)",
            gitHubUrl: "Source sur GitHub",
            close: "Fermer"
        }
    }
);

export default (props) => {
    translations.setLanguage(useSelector(s => s.ui.language));
    const { open, setOpen } = props;

    return (
        <Dialog 
            disableBackdropClick={true}
            open={open} 
            onClose={() => setOpen(false)}>
            <DialogTitle>{translations.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {translations.description}
                    <br /><br />
                    {translations.source}
                    <br /><br />
                    <Divider />
                </DialogContentText>
                <DialogActions>
                    <Button variant="text" color="primary" href={WIKI_URL} target="_blank">{translations.wikiUrl}</Button>
                    <Button variant="text" color="primary" href={GITHUB_URL} target="_blank">{translations.gitHubUrl}</Button>
                    <Button variant="contained" color="primary" onClick={() => { setOpen(false); }}>{translations.close}</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
