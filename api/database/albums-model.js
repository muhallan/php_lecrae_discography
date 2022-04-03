const mongoose = require('mongoose');

const SongSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    writers: {
        type: [String],
        required: true
    }
});

const AlbumsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    songs: [SongSchema]
});

mongoose.model(process.env.ALBUM_MODEL, AlbumsSchema, process.env.ALBUM_COLLECTION);
