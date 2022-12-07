import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import { Alert, AlertTitle, Box, Button, Modal } from '@mui/material';

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

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong () {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong () {
        store.hideModals();
    }
    
    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={true}
        >
            <Box sx={style}>
                <Alert severity="warning">
                    <AlertTitle sx={{marginBottom: 3}}>Remove Song?</AlertTitle>
                    Are you sure you want to remove "<b>{songTitle}</b>" from the playlist?
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleConfirmRemoveSong}
                            >
                            Confirm
                        </Button>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleCancelRemoveSong}
                            >
                            Cancel
                        </Button>
                    </Box>
                </Alert>
            </Box>
        </Modal>
    );
}