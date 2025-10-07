const express = require("express");
const router = express.Router();
const {verifyToken }= require('../middleware/authMiddleware');
const { toggleFavourite,getUserFavourites } = require("../controllers/FavouriteTempController");

router.post("/:templateId", verifyToken, toggleFavourite);
router.delete("/:templateId", verifyToken, toggleFavourite);

// ✅ Get all favourites of user
router.get("/", verifyToken, getUserFavourites);
module.exports = router;