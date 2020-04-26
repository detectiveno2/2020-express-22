const express = require("express");
const multer = require("multer");

const controller = require("../controllers/books.controller");
const cookieMiddleware = require("../middlewares/cookies.middleware");

const router = express.Router();
var upload = multer({ dest: "./public/uploads/" });

router.get("/", cookieMiddleware.createAndCountCookies, controller.index);

router.get(
  "/create",
  cookieMiddleware.createAndCountCookies,
  controller.create
);

router.post(
  "/create",
  cookieMiddleware.createAndCountCookies,
  upload.single("cover"),
  controller.postCreate
);

router.get(
  "/edit/:id",
  cookieMiddleware.createAndCountCookies,
  controller.edit
);

router.post(
  "/edit",
  cookieMiddleware.createAndCountCookies,
  upload.single("cover"),
  controller.postEdit
);

router.get(
  "/delete/:id",
  cookieMiddleware.createAndCountCookies,
  controller.delete
);

router.get("/add/:id", controller.add);

module.exports = router;
