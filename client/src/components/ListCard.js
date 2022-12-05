import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import WorkspaceScreen from './WorkspaceScreen';
import { Button } from '@mui/material';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id, expand) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id, expand);
        }
    }

    function handleToggleExpand(event, id, expand) {
        event.stopPropagation();
        if(store.currentList != null && store.currentList._id == idNamePair._id)
            store.toggleListExpanded();
        else
            handleLoadList(event, id, expand);
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
        setText(idNamePair.name);
    }

    function handleClick(event) {
        if(event.detail === 1 && !(store.currentList != null && store.currentList._id == idNamePair._id))
            handleLoadList(event, idNamePair._id, false);
        if(event.detail === 2)
            handleToggleEdit(event);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            let result = store.changeListName(id, text);
            if(result != "error")
                toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let workspace = null;
    if(store.currentList != null && store.currentList._id == idNamePair._id && store.listExpanded)
    {
        workspace =
            <div>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={handleToggleEdit}>
                        Publish
                </Button>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={(event) => {handleDeleteList(event, idNamePair._id)}}>
                        Delete
                </Button>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={handleToggleEdit}>
                        Duplicate
                </Button>
                <WorkspaceScreen />
            </div>
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ display: 'flex', p: 1 }}
            style={{ fontSize: '24pt' }}
            button
            onClick={(event) => {
                handleClick(event)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
            {/*
            <Box sx={{ p: 1 }}>
                <IconButton onClick={handleToggleEdit} aria-label='edit'>
                    <EditIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
                */}
            <Box sx={{ p: 1 }}>
                <IconButton
                onClick={(event) => {handleToggleExpand(event, idNamePair._id, true)}}
                aria-label='expand'
                >
                    <KeyboardDoubleArrowDownIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize:'24pt'}}}
                autoFocus
            />
    }
    return (
        <div>
            {cardElement}
            {workspace}
        </div>
    );
}

export default ListCard;