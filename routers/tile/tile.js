const router = require("express").Router();
const tile = require("../../controllers/tile/tile");
const { add, update } = require("../../validator/tile/tile");
const { url, title } = require("../../validator/common/common");

router.post("/add", add, tile.add);
router.get("/all", tile.tiles);
router.get("/id/:id", tile.tile);
router.get("/:url", tile.byURL);
router.put("/update/url/:id", url, tile.updateURL);
router.put("/update/title/:id", title, tile.updateTitle);
router.put("/update/:id", update, tile.update);
router.delete("/delete/:id", tile.remove);

module.exports = router;
