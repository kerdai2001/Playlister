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

export default function MUIDeleteModal() {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    function handleDeleteList(event) {
        store.deleteMarkedList();
    }
    function handleCloseModal(event) {
        store.hideModals();
    }

    return (
        <Modal
            open={store.listMarkedForDeletion !== null}
        >
            <Box sx={style}>
                <Alert severity="warning">
                    <AlertTitle sx={{marginBottom: 3}}>Delete Playlist?</AlertTitle>
                    Are you sure you want to delete the "<b>{name}</b>" playlist?
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleDeleteList}
                            >
                            Confirm
                        </Button>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={handleCloseModal}
                            >
                            Cancel
                        </Button>
                    </Box>
                </Alert>
            </Box>
        </Modal>
    );
}