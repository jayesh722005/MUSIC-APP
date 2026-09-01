const musicModel = require("../models/music.model.js");
const { uploadFile } = require("../services/storage.services.js");
const albumModel = require("../models/album.model.js");

async function createMusic(req, res) {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Audio file is required" });
    }
    if (!title) {
      return res.status(400).json({ message: "Track title is required" });
    }

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
      url: result.url,
      title: title.trim(),
      artist: req.user.id,
      likes: [],
    });

    const populatedMusic = await musicModel.findById(music._id).populate("artist", "username email");

    res.status(201).json({
      message: "Music created successfully",
      music: populatedMusic,
    });
  } catch (err) {
    console.error("Create music error:", err);
    res.status(500).json({ message: "Failed to upload and create music" });
  }
}

async function createalbum(req, res) {
  try {
    const { title, musics } = req.body;

    if (!title || !musics || !Array.isArray(musics) || musics.length === 0) {
      return res.status(400).json({ message: "Album title and at least one song are required" });
    }

    const album = await albumModel.create({
      title: title.trim(),
      artist: req.user.id,
      musics,
    });

    const populatedAlbum = await albumModel.findById(album._id)
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: { path: "artist", select: "username email" }
      });

    res.status(201).json({
      message: "Album successfully created",
      album: populatedAlbum,
    });
  } catch (err) {
    console.error("Create album error:", err);
    res.status(500).json({ message: "Failed to create album" });
  }
}

async function getAllMusic(req, res) {
  try {
    const music = await musicModel.find().populate("artist", "username email").sort({ createdAt: -1 });
    res.status(200).json({
      message: "Music fetched successfully",
      musics: music,
    });
  } catch (err) {
    console.error("Get all music error:", err);
    res.status(500).json({ message: "Failed to fetch music library" });
  }
}

async function getAllalbum(req, res) {
  try {
    const album = await albumModel.find()
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: { path: "artist", select: "username email" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Successfully fetched albums",
      albums: album,
    });
  } catch (err) {
    console.error("Get all albums error:", err);
    res.status(500).json({ message: "Failed to fetch albums" });
  }
}

async function getAlbumbyId(req, res) {
  try {
    const { albumId } = req.params;

    const album = await albumModel.findById(albumId)
      .populate("artist", "username email")
      .populate({
        path: "musics",
        populate: { path: "artist", select: "username email" }
      });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    return res.status(200).json({
      message: "Successfully fetched album",
      albums: album,
    });
  } catch (err) {
    console.error("Get album by ID error:", err);
    return res.status(500).json({ message: "Failed to fetch album details" });
  }
}

async function toggleLikeMusic(req, res) {
  try {
    const musicId = req.params.musicId || req.params.id;
    const userId = req.user.id;

    const music = await musicModel.findById(musicId);
    if (!music) {
      return res.status(404).json({ message: "Track not found" });
    }

    const isAlreadyLiked = music.likes && music.likes.some(id => id.toString() === userId.toString());

    let updatedMusic;
    if (isAlreadyLiked) {
      updatedMusic = await musicModel.findByIdAndUpdate(
        musicId,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("artist", "username email");

      return res.status(200).json({
        message: "Track removed from favorites",
        isLiked: false,
        likesCount: updatedMusic.likes ? updatedMusic.likes.length : 0,
        music: updatedMusic,
      });
    } else {
      updatedMusic = await musicModel.findByIdAndUpdate(
        musicId,
        { $addToSet: { likes: userId } },
        { new: true }
      ).populate("artist", "username email");

      return res.status(200).json({
        message: "Track added to favorites",
        isLiked: true,
        likesCount: updatedMusic.likes ? updatedMusic.likes.length : 0,
        music: updatedMusic,
      });
    }
  } catch (err) {
    console.error("Toggle like error:", err);
    return res.status(500).json({ message: "Failed to toggle like status" });
  }
}

async function getLikedMusic(req, res) {
  try {
    const userId = req.user.id;
    const likedTracks = await musicModel.find({ likes: userId })
      .populate("artist", "username email")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Liked tracks fetched successfully",
      musics: likedTracks,
    });
  } catch (err) {
    console.error("Get liked music error:", err);
    return res.status(500).json({ message: "Failed to fetch liked tracks" });
  }
}

module.exports = {
  createMusic,
  createalbum,
  getAllMusic,
  getAllalbum,
  getAlbumbyId,
  toggleLikeMusic,
  getLikedMusic,
};