const express = require('express');

const router = express.Router();
const {getAllTeams,getTeam,getPointsTable} = require("../controllers/team");

router.route('/').get(getAllTeams);
router.route('/pointsTable').get(getPointsTable);
router.route('/:id').get(getTeam);

module.exports = router;