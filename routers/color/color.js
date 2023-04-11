const router = require("express").Router();
const color = require("../../controllers/color/color");

router.get("/all", color.colors);

module.exports = router;
