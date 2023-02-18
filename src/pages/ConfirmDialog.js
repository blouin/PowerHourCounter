import React from 'react';
import { useSelector } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

let translations = new LocalizedStrings(
    {
        en: {
            yes: "Yes",
            no: "No",
        },
        fr: {
            yes: "Oui",
            no: "Non",
        }
    }
);

const _DEFAULT = (props) => {
    const { title, children, open, setOpen, onConfirm } = props;
    translations.setLanguage(useSelector(s => s.ui.language));

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}>
            <DialogTitle >{title}</DialogTitle>
            <DialogContent>
                {children}
                <Divider />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={() => setOpen(false)}>{translations.no}</Button>
                <Button variant="contained" color="primary" onClick={() => { setOpen(false); onConfirm(); }}>{translations.yes}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default _DEFAULT;