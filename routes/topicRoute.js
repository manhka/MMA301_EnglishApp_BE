const express = require("express");
const router = express.Router();
const topicController = require("../controllers/topicController");

router.get("/topic/all", topicController.getAllTopics);
router.post("/topic/create", topicController.createTopic);
router.get("/search", topicController.searchTopics);
router.get("/topic/get_by_id/:id", topicController.getTopicById);
router.put("/topic/edit/:id", topicController.updateTopic);
router.delete("/topic/delete:id", topicController.deleteTopic);
module.exports = router;
