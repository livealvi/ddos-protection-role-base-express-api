const router = require("express").Router();
const user = require("../../controllers/user/user");
const { update, changePassword } = require("../../validator/user/user");
const { url, tag } = require("../../validator/common/common");

router.get("/all", user.users);
router.get("/id/:id", user.user);
router.get("/:url", user.byURL);
router.put("/update/:id", update, user.update);
router.get("/:url/page/all", user.userHasManyPages);
router.get("/:url/tile/all", user.userHasManyTiles);
router.put("/update/url/:id", url, user.updateURL);
router.put("/update/tag/:id", tag, user.updateTAG);
router.put("/change/password/:id", changePassword, user.changePassword);
router.delete("/delete/:id", user.remove);

module.exports = router;
