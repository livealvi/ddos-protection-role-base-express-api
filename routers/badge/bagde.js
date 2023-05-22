const router = require("express").Router();
const badge = require("../../controllers/badge/badge");
const { approve, badgeRequest } = require("../../validator/common/common");

router.get("/all", badge.badges);
router.put("/make/request/:id", badgeRequest, badge.makeBadgeRequest);
router.put("/request/approve/:id", approve, badge.badgeApprove);
router.put("/update/by/admin/:id", badgeRequest, badge.adminChangeBadge);
router.get("/request", badge.listOfBadgeRequest);

module.exports = router;
