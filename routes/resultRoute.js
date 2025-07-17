const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

router.post("/result/submit", resultController.submitResult);
router.get("/result/:id", resultController.getResult);

module.exports = router;
