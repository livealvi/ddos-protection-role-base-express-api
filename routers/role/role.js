const router = require("express").Router();
const role = require("../../controllers/role/role");

router.get("/all", role.roles);
router.get("/id/:id", role.role);

module.exports = router;
