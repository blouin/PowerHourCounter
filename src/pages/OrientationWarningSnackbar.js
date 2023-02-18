import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LocalizedStrings from 'localized-strings';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

let translations = new LocalizedStrings(
    {
        en: {
            text: "Best viewed in landscape mode",
        },
        fr: {
            text: "Optimisé pour orientation paysage",
        }
    }
);

const _DEFAULT = () => {
    translations.setLanguage(useSelector(s => s.ui.language));
    const [dismissed, setDismissed] = useState(false);
    const matchesOrientation = useMediaQuery('(orientation:portrait)');
    const matchesHeight = useMediaQuery('(min-width:500px)'); // Check width, cause of when we will have switched
    const show = dismissed ? false : matchesOrientation && matchesHeight;

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={show}
            autoHideDuration={6000}
            onClose={() => setDismissed(true)}
            message={translations.text}
            action={
                <>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setDismissed(true)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </>
            }
        />
    );
}

export default _DEFAULT;