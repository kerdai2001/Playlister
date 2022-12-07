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

export default function MUIErrorModal() {
    const { store } = useContext(GlobalStoreContext);

    let message = store.getErrorMessage();

    return (
        <Modal
            open={message != null}
            disableScrollLock
        >
            <Box sx={style}>
                <Alert severity="error">
                    <AlertTitle sx={{marginBottom: 3}}>Error</AlertTitle>
                    {message}
                    <Box textAlign='center'>
                        <Button
                            variant='contained'
                            sx={{margin: 2, marginBottom: 0}}
                            onClick={() => {
                                store.closeError();
                            }}
                            >
                            Close
                        </Button>
                    </Box>
                </Alert>
            </Box>
        </Modal>
    );
}