const express = require('express');
const { isAuthenticated } = require('../services/authService');

const router = express.Router();

router.get('/check-auth', (req, res) => {
  if (isAuthenticated(req)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
