const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User } = require('../models');

router.post('/', async (req, res) => {
  const { username, password, name } = req.body;
  // console.log(req.body)

  const existingUser = await User.findOne({ where: { username } });

  if (existingUser) {
    // console.log(existingUser);
    return res.status(400).json({ error: `Username "${username}" is already taken` });
  } if (password.length < 8) {
    return res.status(400).json({ error: 'invalid password' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = new User({
    username,
    name,
    password: hashedPassword,
  });

  const savedUser = await user.save();

  return res.status(201).json({ username: savedUser.username, name: savedUser.name });
});

module.exports = router;
