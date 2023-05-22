const router = require("express").Router();
const tile = require("../../controllers/tile/tile");
const { add, update, adminAddTiles } = require("../../validator/tile/tile");
const {
  url,
  title,
  approve,
  logo,
  backgroundImage,
  lock,
} = require("../../validator/common/common");

router.post("/add", add, tile.add);
router.post("/add/by/admin", adminAddTiles, tile.adminCreateTiles);
router.get("/all", tile.tiles);
router.get("/id/:id", tile.tile);
router.get("/:url", tile.byURL);
router.put("/update/url/:id", url, tile.updateURL);
router.put("/update/assign/tile/:id", tile.adminAssignTiles);
router.put("/approve/:id", approve, tile.approve);
router.put("/update/logo/:id", logo, tile.changeLogo);
router.put("/update/lock/:id", lock, tile.lock);
router.put(
  "/update/background/image/:id",
  backgroundImage,
  tile.changeBackgroundImage
);
router.put("/update/title/:id", title, tile.updateTitle);
router.put("/update/:id", update, tile.update);
router.delete("/delete/:id", tile.remove);

module.exports = router;
