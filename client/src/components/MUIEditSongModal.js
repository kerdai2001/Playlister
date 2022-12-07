import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Alert, AlertTitle, Box, Button, Modal, TextField, Typography } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function MUIEditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [ title, setTitle ] = useState(store.currentSong.title);
    const [ artist, setArtist ] = useState(store.currentSong.artist);
    const [ youTubeId, setYouTubeId ] = useState(store.currentSong.youTubeId);

    function handleConfirmEditSong() {
        let newSongData = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        store.addEditSongTransaction(store.currentSongIndex, newSongData);        
    }

    function handleCancelEditSong() {
        store.hideModals();
    }

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    function handleUpdateArtist(event) {
        setArtist(event.target.value);
    }

    function handleUpdateYouTubeId(event) {
        setYouTubeId(event.target.value);
    }

    return (
        <Modal open={true}>
            <Box sx={style}>
                <Alert severity="info">
                    <AlertTitle sx={{marginBottom: 3}}>Edit Song</AlertTitle>
                    <Typography>Title: </Typography>
                    <input 
                            id="edit-song-modal-title-textfield" 
                            className='modal-textfield' 
                            type="text" 
                            defaultValue={title} 
                            onChange={handleUpdateTitle} />
                    <Typography>Artist: </Typography>
                    <input 
                        id="edit-song-modal-artist-textfield" 
                        className='modal-textfield' 
                        type="text" 
                        defaultValue={artist} 
                        onChange={handleUpdateArtist} />
                    <Typography>YouTube ID: </Typography>
                    <input 
                        id="edit-song-modal-youTubeId-textfield" 
                        className='modal-textfield' 
                        type="text" 
                        defaultValue={youTubeId} 
                        onChange={handleUpdateYouTubeId} />
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleConfirmEditSong}
                            >
                            Confirm
                        </Button>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleCancelEditSong}
                            >
                            Cancel
                        </Button>
                    </Box>
                </Alert>
            </Box>
        </Modal>
    );
}