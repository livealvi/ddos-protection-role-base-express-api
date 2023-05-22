const router = require("express").Router();
const tag = require("../../controllers/tag/tag");
const { add } = require("../../validator/tag/tag");

router.post("/add", add, tag.add);
router.get("/all", tag.tags);
router.get("/:id", tag.tag);
router.put("/update/:id", add, tag.update);
router.delete("/delete/:id", tag.remove);

module.exports = router;
