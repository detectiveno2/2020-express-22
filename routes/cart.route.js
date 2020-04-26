const express = require("express");

const controller = require("../controllers/cart.controller");
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', controller.index);

router.get('/remove/:id', controller.remove);

router.get('/hire', authMiddleware.requireAuth, controller.hire);

module.exports = router;