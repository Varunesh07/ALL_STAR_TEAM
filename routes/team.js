// routes/team.js
const express = require("express");
const router = express.Router();
const {
  getAllTeams,
  getTeam,
  getPointsTable,
  insertSingleTeam,
  deleteTeam,
  updateTeam
} = require("../controllers/team");

// GET all teams
router.route("/").get(getAllTeams);

// POST new team
router.route("/").post(insertSingleTeam);

// GET points table
router.route("/pointsTable").get(getPointsTable);

// GET, DELETE, UPDATE team by ID
router.route("/:id")
  .get(getTeam)
  .delete(deleteTeam)
  .patch(updateTeam);  // optional: for edit later

module.exports = router;