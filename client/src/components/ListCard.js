import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import WorkspaceScreen from './WorkspaceScreen';
import { Button, Typography, Grid } from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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
        if(event.detail === 2 && idNamePair.published == "")
            handleToggleEdit(event);
    }

    function handleLike(event) {
        event.stopPropagation();
        store.addLike(idNamePair._id);
    }

    function handleDislike(event) {
        event.stopPropagation();
        store.addDislike(idNamePair._id);
    }

    function handlePublish(event) {
        event.stopPropagation();
        store.publishList();
    }

    function handleDuplicate(event) {
        event.stopPropagation();
        store.duplicateList(store.currentList);
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

    let selectClass = {fontSize: 24};
    if (store.currentList != null && idNamePair._id == store.currentList._id) {
        selectClass = {fontSize: 24, color: "#00a0ff"};
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let workspace = null;
    let expandIcon = <ExpandMoreIcon style={{fontSize:'24pt'}} />;
    if(store.currentList != null && store.currentList._id == idNamePair._id && store.listExpanded)
    {
        expandIcon = <ExpandLessIcon style={{fontSize:'24pt'}} />;

        workspace =
            <div>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={handlePublish}
                    disabled={idNamePair.published != ""}>
                        Publish
                </Button>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={(event) => {handleDeleteList(event, idNamePair._id)}}
                    disabled={store.currentView != 0}>
                        Delete
                </Button>
                <Button variant="contained"
                    sx={{width: 100, margin: 1}}
                    onClick={handleDuplicate}
                    disabled={store.isGuest()}>
                        Duplicate
                </Button>
                <WorkspaceScreen />
            </div>
    }

    let editButton = idNamePair.published != "" ? "" : 
        <Box>
            <IconButton onClick={handleToggleEdit} aria-label='edit'>
                <EditIcon style={{fontSize:'24pt'}} />
            </IconButton>
        </Box>;

    let grid = "";
    if(idNamePair.published == "")
    {
        grid =
            <Grid container spacing={1} sx={{p: 0}}>
                <Grid item xs={8}>
                    <Typography sx={selectClass}>{idNamePair.name}</Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography style={{fontSize: "12pt"}}>by <b>{idNamePair.userName}</b></Typography>
                </Grid>
            </Grid>
    }
    else
    {
        grid =
            <Grid container spacing={1} sx={{p: 0}}>
                <Grid item xs={8}>
                    <Typography sx={selectClass}>{idNamePair.name}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{display: "flex", alignItems: 'center'}}>
                        <IconButton onClick={handleLike} aria-label='edit' disabled={store.isGuest()}>
                            <ThumbUpIcon style={{fontSize:'16pt'}} />
                        </IconButton>
                        <Typography style={{fontSize: "12pt"}}>{idNamePair.likes}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Box sx={{display: "flex", alignItems: 'center'}}>
                        <IconButton onClick={handleDislike} aria-label='edit' disabled={store.isGuest()}>
                            <ThumbDownIcon style={{fontSize:'16pt'}} />
                        </IconButton>
                        <Typography style={{fontSize: "12pt"}}>{idNamePair.dislikes}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <Typography style={{fontSize: "12pt"}}>by <b>{idNamePair.userName}</b></Typography>
                </Grid>
                <Grid item xs={6} style={{display: "inline-flex", whiteSpace: "pre"}}>
                    <Typography style={{fontSize: "12pt"}}>Published: </Typography>
                    <Typography style={{fontSize: "12pt", color: "green"}}>{idNamePair.published}</Typography>
                </Grid>
                <Grid item xs={6} style={{display: "inline-flex", whiteSpace: "pre"}}>
                    <Typography style={{fontSize: "12pt"}}>Listens: </Typography>
                    <Typography style={{fontSize: "12pt", color: "red"}}>{idNamePair.listens}</Typography>
                </Grid>
            </Grid>
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            style={{ fontSize: '24pt', backgroundColor: "#CEE7FF", marginBottom: 5, borderRadius: 15, height: 120}}
            button
            onClick={(event) => {
                handleClick(event)
            }}
        >
            {grid}
            {/*
            <Box sx={{ p: 1 }}>
                <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                    <DeleteIcon style={{fontSize:'24pt'}} />
                </IconButton>
            </Box>
                */}

            <Box>
                <IconButton
                onClick={(event) => {handleToggleExpand(event, idNamePair._id, true)}}
                aria-label='expand'
                >
                    {expandIcon}
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