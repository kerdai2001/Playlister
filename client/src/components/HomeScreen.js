import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';
import {Box, IconButton, TextField} from '@mui/material/';

import WorkspaceScreen from './WorkspaceScreen';
import Statusbar from './Statusbar';
import YouTubePlayer from './YouTubePlayer';
import MUIErrorModal from './MUIErrorModal';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    let youTubePlayer = "";

    if (store.currentList == null) {
        listCard = 
            <List sx={{ bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            </List>;
        youTubePlayer = "";
    }
    else
    {
        listCard = <WorkspaceScreen />

        if(store.currentList.songs.length > 0)
            youTubePlayer =
                <div>
                    <Box id="youtube-player">
                        <YouTubePlayer />
                        <Typography sx={{fontWeight: 'bold'}}>Now Playing</Typography>
                    </Box>
                    <Box id="youtube-player-description" sx={{marginTop: 1}}>
                        <Typography>Playlist: {store.currentList == null ? "" : store.currentList.name}</Typography>
                        <Typography>Song: #{store.youTubeCurrentSong + 1}</Typography>
                        <Typography>Title: {store.currentList.songs[store.youTubeCurrentSong].title}</Typography>
                        <Typography>Artist: {store.currentList.songs[store.youTubeCurrentSong].artist}</Typography>
                    </Box>
                </div>
    }

    return (
        <div>
            <MUIErrorModal />
            <div id="playlist-selector">
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
                
                <Box sx={{padding: 1, display: "flex", alignItems: "center"}}>
                    <IconButton><HomeIcon sx={{fontSize: 40}}/></IconButton>
                    <IconButton><GroupsIcon sx={{fontSize: 40}}/></IconButton>
                    <IconButton><PersonIcon sx={{fontSize: 40}}/></IconButton>
                    <TextField id="outlined-basic" label="Search" variant="outlined" sx={{marginLeft:"10%", width: "50%"}}/>
                    <Typography sx={{marginLeft: "15%"}}>Sort By</Typography>
                    <IconButton><SortIcon sx={{fontSize: 40}}/></IconButton>
                </Box>

                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
                
                {youTubePlayer}

                <Statusbar />
            </div>
        </div>
    )
}

export default HomeScreen;