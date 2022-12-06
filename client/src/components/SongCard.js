import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

import { Fab, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        event.stopPropagation();
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        event.stopPropagation();
        store.youTubeSetCurrentSong(index);
    }

    function handleEdit(event) {
        event.stopPropagation();
        store.showEditSongModal(index, song);
    }

    let cardClass = "list-card unselected-list-card";

    if(store.youTubeCurrentSong == index)
        cardClass = "list-card player-current-song";

    let buttons = store.currentList.published ? "" :
        <div>
            <Fab
                id={"edit-song-" + index}
                className="list-card-button"
                onClick={handleEdit}
                sx={{padding: 0, marginTop: "-1%", marginRight: 1, boxShadow: "none", border: 1, borderColor: "gray"}}
                size="small">
                    <EditIcon sx={{fontSize: 30}}/>
            </Fab>
            <Fab
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleRemoveSong}
                sx={{padding: 0, marginTop: "-1%", marginRight: 1, boxShadow: "none", border: 1, borderColor: "gray"}}
                size="small">
                    <CloseIcon sx={{fontSize: 30}}/>
            </Fab>
        </div>;

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
            style={{alignItems: 'center'}}
        >
            <Typography
                id={'song-' + index + '-link'}
                className="song-link"
                display="inline">
                {index + 1 + ". "}
                {song.title} by {song.artist}
            </Typography>
            {buttons}
        </div>
    );
}

export default SongCard;