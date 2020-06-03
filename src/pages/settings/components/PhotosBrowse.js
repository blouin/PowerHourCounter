import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ipc, getFilesInFolder, IPC_MESSAGE_SELECT_FOLDER_REQUEST, IPC_MESSAGE_SELECT_FOLDER_RESPONSE } from '../../../utilities/electron';
import { default as store, PHOTOS_STATE_NA, PHOTOS_STATE_LOADING, PHOTOS_STATE_READY } from '../../../store/store';
import { SET_FOLDER, SET_STATE, SET_FILES } from '../../../store/reducers/photos';

// Electron folder browser function
const selectFolderFunc = () => {
    
    ipc.once(IPC_MESSAGE_SELECT_FOLDER_RESPONSE, async (event, args) => {
        if (event) {
            const folder = args.length > 0 ? args[0] : '';
            if (folder !== '') {
                
                store.dispatch({ type: SET_FOLDER, folder: folder });
                store.dispatch({ type: SET_STATE, state: PHOTOS_STATE_LOADING });

                try {
                    // Get files in folder
                    const imageFiles = await getFilesInFolder(folder)
                    store.dispatch({ type: SET_FILES, files: imageFiles });
                    store.dispatch({ type: SET_STATE, state: PHOTOS_STATE_READY });
                }
                catch (e) {
                    store.dispatch({ type: SET_FILES, files: [] });
                    store.dispatch({ type: SET_FOLDER, folder: '' });
                    store.dispatch({ type: SET_STATE, state: PHOTOS_STATE_NA });
                }
            }
        }
    })
    
    ipc.send(IPC_MESSAGE_SELECT_FOLDER_REQUEST)
}

export default (props) => {
    const classes = props.classes;
    const translations = props.translations;

    return (
        <>
            <Button variant="contained" color="primary" className={classes.photosOptionButton} onClick={selectFolderFunc}>
                {translations.filesChooseFolder}
            </Button>
            <PhotosInfo translations={translations} classes={classes} />
        </>
    );
}

const PhotosInfo = (props) => {
    const classes = props.classes;
    const translations = props.translations;
    const photos = useSelector(s => s.photos);

    if (photos.state === PHOTOS_STATE_NA) {
        return (null);
    }

    if (photos.state === PHOTOS_STATE_LOADING) {
        return (<LinearProgress  />);
    }
    
    return (
        <>
            <Typography className={classes.photosOptionText}>
                {photos.folder.length > 50 ? `${photos.folder.substring(0, 22)}...${photos.folder.substring(photos.folder.length - 22)}` : photos.folder}
            </Typography>
            <Typography className={classes.photosOptionText}>
                {translations.formatString(translations.filesCountFolder, photos.files.length)}
            </Typography>
        </>
    );
}