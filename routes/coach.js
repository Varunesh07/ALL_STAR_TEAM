const express = require('express');

const router = express.Router();
const {getAllCoaches,getCoach} = require("../controllers/coach");

router.route('/').get(getAllCoaches);
router.route('/:id').get(getCoach);
module.exports = router;