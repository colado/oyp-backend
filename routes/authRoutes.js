const express = require('express');
const { isAuthenticated } = require('../services/authService');

const router = express.Router();

router.get('/check-auth', async (req, res) => {
  const authenticated = await isAuthenticated(req);
  if (authenticated) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
