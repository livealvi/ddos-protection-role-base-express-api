const router = require("express").Router();
const user = require("../../controllers/user/user");
const {
  update,
  changePassword,
  editRequest,
  addUser,
} = require("../../validator/user/user");
const { url, tag, autoApprove } = require("../../validator/common/common");

router.get("/all", user.users);
router.get("/id/:id", user.user);
router.get("/:url", user.byURL);
router.post("/add/by/:id", addUser, user.userAddByAdmin);
router.put("/update/:id", update, user.update);
router.get("/:url/page/all", user.userHasManyPages);
router.get("/:url/tile/all", user.userHasManyTiles);
router.put("/update/url/:id", url, user.updateURL);
router.put("/update/tag/:id", tag, user.updateTAG);
router.put("/delete/tag/:id", tag, user.deleteTAG);
router.put("/change/password/:id", changePassword, user.changePassword);
router.put("/auto/approve/:id", autoApprove, user.autoApprove);
//router.put("/edit/request/:id", editRequest, user.editRequest);
router.delete("/delete/:id", user.remove);

module.exports = router;
