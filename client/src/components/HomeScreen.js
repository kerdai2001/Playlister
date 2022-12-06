import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import SortIcon from '@mui/icons-material/Sort';

import {Box, IconButton, Menu, MenuItem, Tab, Tabs, TextField} from '@mui/material/';

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
        console.log("check current view");
        switch(store.currentView) {
            case 0:
                store.loadIdNamePairs();
                break;
            case 1:
            case 2:
                store.loadPublishedNamePairs();
                break;
        }
    }, []);

    const [tabValue, setTabValue] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [menuAnchor, setMenuAnchor] = useState(null);

    function handleCommentKeyPress(event) {
        if(event.code === "Enter" && commentText != "")
        {
            store.addComment(commentText);
            setCommentText("");
        }
    }

    function handleCommentChange(event) {
        setCommentText(event.target.value);
    }

    function handleSortByCreate() {
        store.sortByCreate();
        setMenuAnchor(null);
    }

    function handleSortByUpdate() {
        store.handleSortByUpdate();
        setMenuAnchor(null);
    }

    function handleSortByName() {
        store.sortByName();
        setMenuAnchor(null);
    }

    async function handleChangeView(index) {
        store.changeView(index);
    }

    let listCard = "";
    let youTubePlayer = "";

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

    let tabs = "";
    let commentTab = "";
    
    if (store.currentList == null) {
        youTubePlayer = "";
    }
    else
    {
        tabs =
            <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                <Tab label="Player"/>
                <Tab label="Comments"/>
            </Tabs>

        if(tabs.props.value == 1)
        {
            commentTab = 
                <Box>
                    <List 
                        id="comment-list" 
                        sx={{ width: '100%'}}
                    >
                        {
                            store.currentList.comments.map((comment, index) => (
                                <div
                                id={'comment-' + index}
                                key={'comment-' + index}
                                className={"comment-card"}
                                >
                                    <Typography sx={{fontWeight: 'bold'}}>{comment.userName}</Typography>
                                    <Typography>{comment.comment}</Typography>
                                </div>
                            ))  
                        }
                    </List> 
                    <div id="comment-box">
                        <TextField
                            value={commentText}
                            onChange={handleCommentChange}
                            onKeyPress={handleCommentKeyPress}
                            id="outlined-basic"
                            label="Add Comment"
                            variant="outlined"
                            sx={{width: "100%"}}
                            />
                    </div>
                </Box>
        }

        if(store.currentList.songs.length > 0)
        {
            let playerTab = "";
            if(tabs.props.value == 0)
            {
                playerTab =
                    <div>
                        <Box id="youtube-player-description" sx={{marginTop: 1}}>
                            <Typography>Playlist: {store.currentList == null ? "" : store.currentList.name}</Typography>
                            <Typography>Song: #{store.youTubeCurrentSong + 1}</Typography>
                            <Typography>Title: {store.currentList.songs[store.youTubeCurrentSong].title}</Typography>
                            <Typography>Artist: {store.currentList.songs[store.youTubeCurrentSong].artist}</Typography>
                        </Box>
                    </div>
            }

            youTubePlayer =
                <div>
                    <YouTubePlayer />
                    {playerTab}
                </div>
        }
    }

    return (
        <div>
            <MUIErrorModal />
            <div id="playlist-selector">
                <Box sx={{padding: 1, display: "flex", alignItems: "center"}}>
                    <IconButton onClick={() => {handleChangeView(0)}} color={store.currentView == 0? "primary" : "default"}>
                        <HomeIcon sx={{fontSize: 40}}/>
                    </IconButton>
                    <IconButton onClick={() => {handleChangeView(1)}} color={store.currentView == 1? "primary" : "default"}>
                        <GroupsIcon sx={{fontSize: 40}}/>
                    </IconButton>
                    <IconButton onClick={() => {handleChangeView(2)}} color={store.currentView == 2? "primary" : "default"}>
                        <PersonIcon sx={{fontSize: 40}}/>
                    </IconButton>
                    <TextField id="outlined-basic" label="Search" variant="outlined" sx={{marginLeft:"10%", width: "50%"}}/>
                    <Typography sx={{marginLeft: "15%"}}>Sort By</Typography>
                    <IconButton onClick={(e) => {setMenuAnchor(e.currentTarget)}}>
                        <SortIcon sx={{fontSize: 40}}/>
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        keepMounted
                        open={Boolean(menuAnchor)}
                        onClose={() => {setMenuAnchor(null)}}
                    >
                        <MenuItem onClick={handleSortByCreate}>By Creation Date (Old-New)</MenuItem>
                        <MenuItem onClick={handleSortByUpdate}>By Last Edit Date (Old-New)</MenuItem>
                        <MenuItem onClick={handleSortByName}>By Name (A-Z)</MenuItem>
                    </Menu>
                </Box>

                <div id="list-selector-list">
                    {
                        listCard
                    }
                    <MUIDeleteModal />
                </div>
                
                <Box id="tabs">
                    {tabs}
                </Box>
                {youTubePlayer}
                {commentTab}
                <Statusbar />
            </div>
        </div>
    )
}

export default HomeScreen;