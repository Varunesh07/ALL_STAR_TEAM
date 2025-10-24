const express = require('express');

const router = express.Router();
const {addMatchLog,
       getAllMatches,
       getMatch
    } = require("../controllers/matchlog");

router.route('/').get(getAllMatches).post(addMatchLog);
router.route('/:id').get(getMatch);

module.exports = router;