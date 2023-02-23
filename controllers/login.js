const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: 'invalid username' });
  }
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'invalid password' });
  }

  const token = jwt.sign({ username: user.username, id: user.id, name: user.name }, process.env.SECRET, { expiresIn: '7d' });

  return res.status(200).send({ token, username, name: user.name });
});

module.exports = router;
