// routes/matchlog.js
const express = require("express");
const router = express.Router();
const { getAllMatches, getMatch, addMatchLog , deleteMatch } = require("../controllers/matchlog");

router.route("/").get(getAllMatches).post(addMatchLog);
router.route("/:id").get(getMatch).delete(deleteMatch);

module.exports = router;