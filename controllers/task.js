const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Task } = require('../models');
const { getTokenFrom, hasAccess } = require('../util/access');
const { sequelize } = require('../util/db');

const userIdFromRequest = req => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  return decodedToken.id;
};

router.post('/:id/done', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task)
    return res.status(404).json({ error: 'invalid task id' });
  if (!hasAccess(req, task.tasklistId))
    return res.status(403).json({ error: 'no access' });
  const userId = userIdFromRequest(req);
  await Task.update(
    {
      completedAt: sequelize.fn('NOW'),
      completedBy: userId,
    },
    {
      where: { id: req.params.id },
    },
  );
  const updatedTask = await Task.findByPk(req.params.id);
  return res.status(201).json(updatedTask);
});

router.patch('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task)
    return res.status(404).json({ error: 'invalid task id' });
  if (!hasAccess(req, task.tasklistId))
    return res.status(403).json({ error: 'no access' });
  let {
    name, frequency, afterFlexibility, beforeFlexibility,
  } = req.body;

  if (!name)
    name = task.name;
  if (!frequency)
    frequency = task.frequency;
  if (!afterFlexibility)
    afterFlexibility = task.afterFlexibility;
  if (!beforeFlexibility)
    beforeFlexibility = task.beforeFlexibility;

  await Task.update(
    {
      name, frequency, afterFlexibility, beforeFlexibility,
    },
    { where: { id: req.params.id } },
  );

  const updatedTask = await Task.findByPk(req.params.id);
  return res.status(201).json(updatedTask);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task)
    return res.status(404).json({ error: 'invalid task id' });

  if (!hasAccess(req, task.tasklistId))
    return res.status(403).json({ error: 'no access' });

  await task.destroy();
  return res.status(204).send();
});

module.exports = router;
