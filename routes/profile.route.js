const express = require("express");
const multer = require("multer");

const controller = require("../controllers/profile.controller");

var upload = multer({ dest: "./public/uploads/" });

const router = express.Router();

router.get("/:id", controller.index);

router.get("/update/:id", controller.update);

router.post("/update/:id", upload.single("avatar"), controller.postUpdate);

module.exports = router;
