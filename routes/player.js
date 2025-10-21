const express = require('express');

const router = express.Router();
const {getAllPlayers,getPlayer,orangeCap,purpleCap} = require("../controllers/player");

router.route('/').get(getAllPlayers);
router.route('/orangeCap').get(orangeCap);
router.route('/purpleCap').get(purpleCap);
router.route('/:id').get(getPlayer);
module.exports = router;