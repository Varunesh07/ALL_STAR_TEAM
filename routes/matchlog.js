// routes/matchlog.js
const express = require("express");
const router = express.Router();
const { getAllMatches, getMatch, addMatchLog } = require("../controllers/matchlog");

router.route("/").get(getAllMatches).post(addMatchLog);
router.route("/:id").get(getMatch);

module.exports = router;