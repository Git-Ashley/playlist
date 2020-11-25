const express = require('express');
const Course = require('../models/card-course-model/course');

const router = express.Router();

router.use((req, res, next) => {
  req.courseId = req.params.courseId;
  next();
});

module.exports = router;
