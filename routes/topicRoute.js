const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");

router.get("/topic/all", topicController.getAllTopics);

module.exports = router;
