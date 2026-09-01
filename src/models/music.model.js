const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
}, { timestamps: true });

const musicModel = mongoose.model("music", musicSchema);

module.exports = musicModel;