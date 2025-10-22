const express = require('express');

const router = express.Router();
const {getAllPlayers,getPlayer,orangeCap,purpleCap,insertSinglePlayer,deletePlayer} = require("../controllers/player");

router.route('/').get(getAllPlayers).post(insertSinglePlayer);
router.route('/orangeCap').get(orangeCap);
router.route('/purpleCap').get(purpleCap);
router.route('/:id').get(getPlayer).delete(deletePlayer);
module.exports = router;