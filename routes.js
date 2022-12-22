const { Router } = require("express");
const controller = require("./controller");

const router = Router();

router.post("/buy/:id/:symbol", controller.buy);
router.post("/sell/:id/:symbol", controller.sell);

module.exports = router;
