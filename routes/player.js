// routes/player.js
const express = require("express");
const router = express.Router();
const {
  getAllPlayers,
  getPlayer,
  orangeCap,
  purpleCap,
  insertSinglePlayer,
  deletePlayer,
  updatePlayer
} = require("../controllers/player");

// GET all players
router.route("/").get(getAllPlayers);

// POST new player
router.route("/").post(insertSinglePlayer);

// Orange & Purple Cap
router.route("/orangeCap").get(orangeCap);
router.route("/purpleCap").get(purpleCap);

// GET, DELETE, UPDATE player by ID
router.route("/:id")
  .get(getPlayer)
  .delete(deletePlayer)
  .patch(updatePlayer);  // optional: for edit later

module.exports = router;