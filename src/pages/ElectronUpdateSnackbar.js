import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LocalizedStrings from 'localized-strings';
import { isElectron, ipc, IPC_MESSAGE_UPDATE_AVAILABLE, IPC_MESSAGE_UPDATE_DOWNLOADED, IPC_MESSAGE_UPDATE_RESTART } from '../utilities/electron';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { default as store, UPDATE_NA, UPDATE_AVAILABLE, UPDATE_DOWNLOADED } from '../store/store';
import { SET_UPDATE } from '../store/reducers/ui';

let translations = new LocalizedStrings(
    {
        en: {
            available: "Downloading update...",
            downloaded: "Update will be installed on restart...",
            restart: "Restart now"
        },
        fr: {
            available: "Téléchargement de la mise à jour...",
            downloaded: "La mise à jour sera installée au redémarrage...",
            restart: "Redémarrer maintenant"
        }
    }
);

if (ipc && isElectron) {
    ipc.on(IPC_MESSAGE_UPDATE_AVAILABLE, () => {
        ipc.removeAllListeners(IPC_MESSAGE_UPDATE_AVAILABLE);
        store.dispatch({ type: SET_UPDATE, update: UPDATE_AVAILABLE });
    });
    ipc.on(IPC_MESSAGE_UPDATE_DOWNLOADED, () => {
        ipc.removeAllListeners(IPC_MESSAGE_UPDATE_DOWNLOADED);
        store.dispatch({ type: SET_UPDATE, update: UPDATE_DOWNLOADED });
    });
}

export default () => {
    translations.setLanguage(useSelector(s => s.ui.language));
    const dispatch = useDispatch();
    const show = useSelector(s => s.ui.update !== UPDATE_NA);
    const text = useSelector(s => s.ui.update === UPDATE_DOWNLOADED) ? translations.downloaded : translations.available;
    const restart = useSelector(s => s.ui.update === UPDATE_DOWNLOADED);

    return (
        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={show}
            autoHideDuration={6000}
            onClose={() => dispatch({ type: SET_UPDATE, update: UPDATE_NA })}
            message={text}
            action={
            <>
                {restart && (
                    <Button color="primary" size="small" onClick={() => ipc.send(IPC_MESSAGE_UPDATE_RESTART)}>
                        {translations.restart}
                    </Button>)
                }
                <IconButton size="small" aria-label="close" color="inherit" onClick={() => dispatch({ type: SET_UPDATE, update: UPDATE_NA })}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </>
            }
        />
    );
}