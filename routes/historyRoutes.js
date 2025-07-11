const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.post("/history/create", historyController.createHistory);

router.get("/history/:userId", historyController.getUserHistory);

module.exports = router;
