const express = require('express');

const router = express.Router();
const {getAllCoaches,getCoach,insertSingleCoach,deleteCoach} = require("../controllers/coach");

router.route('/').get(getAllCoaches).post(insertSingleCoach);
router.route('/:id').get(getCoach).delete(deleteCoach);
module.exports = router;