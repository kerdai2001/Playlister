import React, {useContext} from 'react';
import YouTube from 'react-youtube';
import { GlobalStoreContext } from '../store'

import FastRewindIcon from '@mui/icons-material/FastRewind';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';

import {Box, IconButton, Typography} from '@mui/material/';

export default function YouTubePlayer() {
    const { store } = useContext(GlobalStoreContext);
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST
    let playlist = store.youTubePlaylist;

    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    let currentSong = store.youTubeCurrentSong;

    const playerOptions = {
        height: '240',
        width: '480',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong];
        player.loadVideoById(song);
        player.playVideo();
    }

    function onPlayerReady(event) {
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
        store.initYouTubePlayer(event.target);
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            store.nextSong();
            loadAndPlayCurrentSong(player);
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
        }
    }

    function pauseSong() {
        store.youTubePlayer.pauseVideo();
    }

    function resumeSong() {
        store.youTubePlayer.playVideo();
    }

    return (
        <div>
            <Box id="youtube-player">
                <YouTube
                videoId={playlist[currentSong]}
                opts={playerOptions}
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange} />
                <Typography sx={{fontWeight: 'bold'}}>Now Playing</Typography>
            </Box>

            <Box id="youtube-player-buttons">
                <IconButton onClick={store.prevSong}>
                    <FastRewindIcon sx={{fontSize: 40}}/>
                </IconButton>
                <IconButton onClick={pauseSong}>
                    <StopIcon sx={{fontSize: 40}}/>
                </IconButton>
                <IconButton onClick={resumeSong}>
                    <PlayArrowIcon sx={{fontSize: 40}}/>
                </IconButton>
                <IconButton onClick={store.nextSong}>
                    <FastForwardIcon sx={{fontSize: 40}}/>
                </IconButton>
            </Box>
        </div>
    )
}