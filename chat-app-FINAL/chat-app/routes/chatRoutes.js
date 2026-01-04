const express = require("express");
const router = express.Router();
const { getChatPage } = require("../controllers/chatController");
const { isAuth } = require("../middleware/auth");

// Chat page (protected)
router.get("/chat", isAuth, getChatPage);

module.exports = router;
