const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
  // res.send(req.query) // ?name=Duri&no=11
  // res.send(req.params) /:something
});

module.exports = router;

