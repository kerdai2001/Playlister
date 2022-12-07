/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist)

router.get('/publishedplaylistpairs', auth.verify, PlaylistController.getPublishedPlaylists)
router.get('/searchhome/:input', auth.verify, PlaylistController.searchHome)
router.get('/searchbyplaylist/:input', auth.verify, PlaylistController.searchByPlaylist)
router.get('/searchbyuser/:input', auth.verify, PlaylistController.searchByUser)

module.exports = router