import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import { default as DropzoneArea } from './material-ui-dropzone/DropzoneArea'
import { SET_FILES, SET_STATE } from '../../../store/reducers/photos';
import { convertImagesForStore } from '../../../utilities/arraybuffer'
import { PHOTOS_STATE_NA, PHOTOS_STATE_LOADING, PHOTOS_STATE_READY } from '../../../store/store';
import { logModalView } from '../../../utilities/analytics';

const MAX_FILES = 200;

export default (props) => {
    const classes = props.classes;
    const translations = props.translations;
    const [open, setOpen] = useState(false);

    return (
        <>
        
            <Button variant="contained" color="primary" className={classes.photosOptionButton} onClick={() => { logModalView('PhotosUpload'); setOpen(true) }}>
                {translations.filesChooseOnline}
            </Button>
            <PhotosDialog
                title={translations.uploadTitle}
                open={open}
                setOpen={setOpen}
                translations={translations}
                classes={classes}>
                {translations.uploadTitle}
            </PhotosDialog>
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
        return (<LinearProgress />);
    }
    
    return (
        <Typography className={classes.photosOptionText}>
            {translations.formatString(translations.filesCountOnline, photos.files.length)}
        </Typography>
    );
}

export const PhotosDialog = (props) => {
    const { title, open, setOpen } = props;
    const classes = props.classes;
    const translations = props.translations;
    const dispatch = useDispatch();
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [progressVisible, setProgressVisible] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);

    return (
        <Dialog
            open={open}
            disableBackdropClick={true}
            onClose={() => setOpen(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent className={classes.dropZoneDialog}>
                {progressVisible && <LinearProgress className={classes.dropzoneProgress} />}
                <DropzoneArea
                    acceptedFiles={['image/*']}
                    filesLimit={MAX_FILES}
                    maxFileSize={5000000}
                    showPreviewsInDropzone={false}
                    showPreviews={true}
                    showAlerts={['error']}
                    dropzoneText={translations.uploadText}
                    previewText={translations.uploadPreviewText}
                    getFileLimitExceedMessage={(max) => translations.formatString(translations.uploadFileLimitExceedMessage, max)}
                    dropzoneClass={classes.dropzoneClass}
                    dropzoneParagraphClass={classes.dropzoneParagraphClass}
                    onDrop={() => setProgressVisible(true)}
                    onChange={(files) => { setProgressVisible(false); setImageFiles(files); setConfirmDisabled(files.length === 0)} }
                />
                <Divider />
            </DialogContent>
            <DialogActions>
                <Button variant="text" color="primary" onClick={() => setOpen(false)}>{translations.uploadCancelText}</Button>
                <Button variant="contained" color="primary" disabled={confirmDisabled} 
                    onClick={() => {

                        setOpen(false); 
                        dispatch({ type: SET_STATE, state: PHOTOS_STATE_LOADING });

                        convertImagesForStore(imageFiles)
                            .then((storeFiles) => {
                                dispatch({ type: SET_FILES, files: storeFiles});
                                dispatch({ type: SET_STATE, state: PHOTOS_STATE_READY });
                            })
                            .catch(() => { 
                                dispatch({ type: SET_FILES, files: [] });
                                dispatch({ type: SET_STATE, state: PHOTOS_STATE_NA });
                            })

                    }}>
                        {translations.uploadSubmitText}
                    </Button>
            </DialogActions>
        </Dialog>
    );
} 