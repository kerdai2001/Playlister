const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        ownerEmail: { type: String, required: true },
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        comments: {type: [{userName: String, comment: String}], required: true},
        userName: {type: String, required: true},
        published: {type: String},
        likes: {type: Number},
        dislikes: {type: Number},
        listens: {type: Number}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)