const express = require('express');

const router = express.Router();
const {getAllTeams,
       getTeam,
       getPointsTable,
       insertSingleTeam,
       deleteTeam, 
       updateTeam} = require("../controllers/team");

router.route('/').get(getAllTeams).post(insertSingleTeam);
router.route('/pointsTable').get(getPointsTable);
router.route('/:id').get(getTeam).delete(deleteTeam).patch(updateTeam);

module.exports = router;