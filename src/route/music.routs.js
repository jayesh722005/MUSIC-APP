const express = require('express');
const router = express.Router();
const musicController = require('../controllers/music.controller.js');
const Authmiddleware = require("../middlewares/auth.middleware.js");
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

// Artist Protected Actions
router.post("/upload", Authmiddleware.Authartist, upload.single("music"), musicController.createMusic);
router.post("/album", Authmiddleware.Authartist, musicController.createalbum);

// User Protected Like & Favorites Actions
router.post("/like/:musicId", Authmiddleware.AuthUser, musicController.toggleLikeMusic);
router.post("/:musicId/like", Authmiddleware.AuthUser, musicController.toggleLikeMusic);
router.get("/favorites", Authmiddleware.AuthUser, musicController.getLikedMusic);
router.get("/liked", Authmiddleware.AuthUser, musicController.getLikedMusic);

// Music & Album Browsing
router.get("/", Authmiddleware.OptionalAuthUser, musicController.getAllMusic);
router.get("/album", Authmiddleware.OptionalAuthUser, musicController.getAllalbum);
router.get("/album/:albumId", Authmiddleware.OptionalAuthUser, musicController.getAlbumbyId);

module.exports = router;
