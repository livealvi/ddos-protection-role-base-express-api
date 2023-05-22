const router = require("express").Router();
const passport = require("passport");
const page = require("../../controllers/page/page");
const { add, update } = require("../../validator/page/page");
const {
  url,
  title,
  approve,
  backgroundImage,
  logo,
  pageRequest,
} = require("../../validator/common/common");

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
router.get(
  "/request",
  passport.authenticate("jwt", { session: false }),
  page.pageRequestList
);
router.get("/public/all", page.publicPage);
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
  "/update/assign/page/:id",
  passport.authenticate("jwt", { session: false }),
  page.adminAssignPages
);
router.put(
  "/approve/:id",
  passport.authenticate("jwt", { session: false }),
  approve,
  page.approve
);
router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  update,
  page.update
);
router.put(
  "/update/logo/:id",
  passport.authenticate("jwt", { session: false }),
  logo,
  page.changeLogo
);
router.put(
  "/update/background/image/:id",
  passport.authenticate("jwt", { session: false }),
  backgroundImage,
  page.changeBackgroundImage
);

router.put(
  "/make/request/:id",
  passport.authenticate("jwt", { session: false }),
  pageRequest,
  page.makePageEditRequest
);

router.put(
  "/request/approve/:id",
  passport.authenticate("jwt", { session: false }),
  approve,
  page.pageEditApprove
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  page.remove
);

router.delete(
  "/delete/request/:id",
  passport.authenticate("jwt", { session: false }),
  page.pageRequestDelete
);

module.exports = router;
