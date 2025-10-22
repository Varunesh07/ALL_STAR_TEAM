const express = require('express');

const router = express.Router();
const {getAllCoaches,
       getCoach,
       insertSingleCoach,
       deleteCoach,
       updateCoach
    } = require("../controllers/coach");

router.route('/').get(getAllCoaches).post(insertSingleCoach);
router.route('/:id').get(getCoach).delete(deleteCoach).patch(updateCoach);
module.exports = router;