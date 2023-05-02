/* eslint-disable camelcase */
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Task } = require('../models');
const { getTokenFrom, hasAccess } = require('../util/access');
const { sequelize } = require('../util/db');
const ChildTask = require('../models/childTask');

const userIdFromRequest = req => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  return decodedToken.id;
};

const getTask = async (req, id) => {
  const timeZoneOffset = req.get('time-zone-offset');
  const offsettedTime = time => ((timeZoneOffset && /^-?\d*$/.test(timeZoneOffset))
    ? `DATE_ADD(${time}, INTERVAL ${-timeZoneOffset} MINUTE)`
    : time);
  const [local_NOW, local_completed_at, child_local_completed_at] = ['NOW()', 'task.completed_at', 'childTasks.completed_at'].map(offsettedTime);
  return Task.findByPk(id, {
    include: {
      model: ChildTask,
      attributes: {
        include: [
          [sequelize.literal(`DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency), ${local_NOW})`), 'daysLeft'],
          [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency - before_flexibility), ${local_NOW}))`), 'earliest'],
          [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency + after_flexibility), ${local_NOW})) / frequency`), 'latest'],
          [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency + after_flexibility), ${local_NOW}))`), 'timeLeft'],
        ],
      },
    },
    attributes: {
      include: [
        [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})`), 'daysLeft'],
        [sequelize.literal(`EXTRACT(HOUR FROM (TIMEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})))`), 'hoursLeft'],
        [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW}) / frequency`), 'daysLeftProportional'],
        [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency - before_flexibility), ${local_NOW}))`), 'earliest'],
        [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency + after_flexibility), ${local_NOW})) / frequency`), 'latest'],
        [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency + after_flexibility), ${local_NOW}))`), 'timeLeft'],
      ],
    },
    order: [
      [sequelize.literal('`childTasks.latest`'), 'ASC'],
      [sequelize.literal('`childTasks.earliest`'), 'ASC'],
      [sequelize.literal('`childTasks.daysLeft`'), 'ASC'],
      [sequelize.literal('`childTasks.timeLeft`'), 'ASC'],
    ],
  });
};
router.post('/:id/done', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
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
      where: { id },
    },
  );
  const updatedTask = await Task.findByPk(id);
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

  const updatedTask = await getTask(req, req.params.id);
  return res.status(201).json(updatedTask);
});

router.patch('/:id/move', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);

  if (!task)
    return res.status(404).json({ error: 'invalid task id' });
  if (!hasAccess(req, task.tasklistId))
    return res.status(403).json({ error: 'no access to task' });

  const newList = req.body.newListId;
  if (!hasAccess(req, newList))
    return res.status(403).json({ error: 'no access to new list' });

  await Task.update(
    { tasklistId: newList },
    { where: { id } },
  );
  return res.status(201).json({ ...task, tasklistId: newList });
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

router.post('/:id/children', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  const childTasks = req.body.childTasks.filter(s => s !== '');

  if (!task)
    return res.status(404).json({ error: 'invalid task id' });
  if (!hasAccess(req, task.tasklistId))
    return res.status(403).json({ error: 'no acces' });
  if (!task.dataValues.hasChildTasks)
    await Task.update({ hasChildTasks: true, completedAt: null }, { where: { id } });
  await ChildTask.bulkCreate(childTasks.map(name => ({ name, parentId: id })));
  const updatedTask = await getTask(req, id);
  const updatedTaskJSON = updatedTask.toJSON();
  updatedTaskJSON.addedCount = childTasks.length;
  return res.status(201).json(updatedTaskJSON);
});

router.post('/:id/tochild', async (req, res) => {
  const { id } = req.params;
  const { newParentId } = req.body;
  if (!newParentId)
    return res.status(400).json({ error: 'missing newParentId' });
  const task = await Task.findByPk(id);
  if (!task)
    return res.status(404).json({ error: 'invalid task id' });
  if (task.hasChildTasks)
    return res.status(400).json({ error: "task can't have child tasks" });
  const newParentTask = await Task.findByPk(newParentId);
  if (!newParentTask)
    return res.status(404).json({ error: 'invalid parent task id' });
  if (task.tasklistId !== newParentTask.tasklistId)
    return res.status(400).json({ error: 'tasks must be in same tasklist' });
  if (!hasAccess(req, task.tasklistId))
    return res.status(400).json({ error: 'no access' });

  await ChildTask.create({ parentId: newParentId, name: task.name, completedAt: task.completedAt });
  const fieldUpdates = { hasChildTasks: true };
  if (newParentTask.hasChildTasks && task.completedAt
    && (!newParentTask.completedAt || newParentTask.completedAt > task.completedAt))
    fieldUpdates.completedAt = task.completedAt;
  await Task.update(
    fieldUpdates,
    { where: { id: newParentId } },
  );
  await task.destroy();
  const updatedParent = await getTask(req, newParentId);
  return res.status(200).json(updatedParent);
});

router.post('/child/:id/done', async (req, res) => {
  const { id } = req.params;
  const childTask = await ChildTask.findByPk(id, { include: { model: Task } });
  // console.log(childTask.task.tasklistId);
  if (!childTask)
    return res.status(404).json({ error: 'invalid id' });
  if (!hasAccess(req, childTask.task.tasklistId))
    return res.status(403).json({ error: 'no access' });
  const userId = userIdFromRequest(req);
  await ChildTask.update(
    {
      completedAt: sequelize.fn('NOW'),
      completedBy: userId,
    },
    { where: { id } },
  );
  await sequelize.query(
    `
    UPDATE tasks
    SET completed_at =
      (SELECT min(completed_at)
       FROM child_tasks
       WHERE child_tasks.parent_id = tasks.id)
    WHERE id = ?;`,
    { replacements: [childTask.parentId] },
  );
  const timeZoneOffset = req.get('time-zone-offset');
  const offsettedTime = time => ((timeZoneOffset && /^-?\d*$/.test(timeZoneOffset))
    ? `DATE_ADD(${time}, INTERVAL ${-timeZoneOffset} MINUTE)`
    : time);
  const [local_NOW, local_completed_at, child_local_completed_at] = ['NOW()', 'task.completed_at', 'childTasks.completed_at'].map(offsettedTime);
  const updatedParent = await Task.findByPk(
    childTask.parentId,
    {
      include: {
        model: ChildTask,
        attributes: {
          include: [
            [sequelize.literal(`DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency), ${local_NOW})`), 'daysLeft'],
            [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency - before_flexibility), ${local_NOW}))`), 'earliest'],
            [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency + after_flexibility), ${local_NOW})) / frequency`), 'latest'],
            [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, frequency + after_flexibility), ${local_NOW}))`), 'timeLeft'],
          ],
        },
      },
      attributes: {
        include: [
          [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})`), 'daysLeft']],
      },
      order: [
        [sequelize.literal('`childTasks.latest`'), 'ASC'],
        [sequelize.literal('`childTasks.earliest`'), 'ASC'],
        [sequelize.literal('`childTasks.daysLeft`'), 'ASC'],
        [sequelize.literal('`childTasks.timeLeft`'), 'ASC'],
      ],
    },
  );
  return res.status(200).json(updatedParent);
});

module.exports = router;
