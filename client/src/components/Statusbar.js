import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    let text ="";
    if (store.currentList)
        text = <Typography variant="h4">{store.currentList.name}</Typography>
    else if(!store.isGuest())
    {
        text =
            <div id="list-selector-heading">
                <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    disabled={store.currentList != null}
                    size="medium"
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h4">Your Lists</Typography>
            </div>
    }

    return (
        <div id="playlister-statusbar">
            {text}
        </div>
    );
}

export default Statusbar;