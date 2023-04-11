const router = require("express").Router();
const passport = require("passport");
const page = require("../../controllers/page/page");
const { add, update } = require("../../validator/page/page");
const { url, title } = require("../../validator/common/common");

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  add,
  page.add
);
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  page.pages
);
router.get("/public/all", page.pagesForSearch);
router.get(
  "/id/:id",
  passport.authenticate("jwt", { session: false }),
  page.page
);
router.get(
  "/:url",
  passport.authenticate("jwt", { session: false }),
  page.byURL
);
router.put(
  "/orders/:id",
  passport.authenticate("jwt", { session: false }),
  page.orders
);
router.put(
  "/update/color/:url",
  passport.authenticate("jwt", { session: false }),
  page.setColorForButton
);
router.put(
  "/update/url/:id",
  passport.authenticate("jwt", { session: false }),
  url,
  page.updateURL
);
router.put(
  "/update/title/:id",
  passport.authenticate("jwt", { session: false }),
  title,
  page.updateTitle
);
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  update,
  page.update
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  page.remove
);

module.exports = router;
