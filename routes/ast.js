const express = require('express');

const router = express.Router();
const {selectAllStarTeam} = require("../controllers/ast");

router.route('/').get(selectAllStarTeam);
module.exports = router;