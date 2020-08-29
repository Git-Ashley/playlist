const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/card-course-model/user');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

router.post('/setpasswd', async (req, res) => {
  const user = req.user;
  const newPass = req.body.newPassword;

  await user.setPassword(newPass);

  console.log('user:', JSON.stringify(user));
  await user.save();

  res.json(user);
});

module.exports = router;
