/* eslint-disable camelcase */
const router = require('express').Router();
const jwt = require('jsonwebtoken');
// const { fn } = require('sequelize');

const {
  Tasklist, User, Role, Task, ChildTask, ShoppingListSection, ShoppingListItem,
} = require('../models');
const { getTokenFrom, hasAccess } = require('../util/access');
const { sequelize } = require('../util/db');

const isCreator = async (req, tasklistId) => {
  const token = getTokenFrom(req);
  if (!token)
    return false;
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken)
    return false;
  const role = await Role.findOne({
    where: {
      userId: decodedToken.id,
      listId: tasklistId,
      description: 'CREATOR',
    },
  });
  return !!role;
};

const canShare = isCreator;
const canDelete = isCreator;

const userIdFromRequest = req => {
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  return decodedToken.id;
};
const tasksToStatus = tasks => {
  if (!tasks.length)
    return 'empty';
  const unknown = tasks.some(task => task.dataValues.daysLeft === null) ? 'unknown' : '';
  if (tasks.some(task => task.dataValues.latest < 0))
    return `late ${unknown}`;
  if (tasks.some(task => task.dataValues.daysLeft < 0))
    return `due ${unknown}`;
  if (tasks.some(task => task.dataValues.daysLeft === 0))
    return `today ${unknown}`;
  if (tasks.some(task => task.dataValues.earliest === 0))
    return `early ${unknown}`;
  return `idle ${unknown}`;
};

// get tasklists of user
router.get('/', async (req, res) => {
  const token = getTokenFrom(req);
  if (!token)
    return res.status(401).json({ error: 'token missing' });
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id)
    return res.status(401).json({ error: 'invalid token' });

  const timeZoneOffset = req.get('time-zone-offset');
  const offsettedTime = time => ((timeZoneOffset && /^-?\d*$/.test(timeZoneOffset))
    ? `DATE_ADD(${time}, INTERVAL ${-timeZoneOffset} MINUTE)`
    : time);
  const [local_NOW, local_completed_at] = ['NOW()', 'completed_at'].map(offsettedTime);

  const lists = await User.findOne({
    where: {
      id: decodedToken.id,
    },
    include: {
      model: Tasklist,
      include: {
        model: Task,
        attributes: {
          include: [
            [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})`), 'daysLeft'],
            [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency - before_flexibility), ${local_NOW}))`), 'earliest'],
            [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency + after_flexibility), ${local_NOW})) / frequency`), 'latest'],
          ],
        },
        raw: true,
      },
    },
    attributes: { exclude: ['password'] },
  });
  const tasklists = lists.tasklists.map(l => (
    {
      id: l.id, name: l.name, type: l.type, status: tasksToStatus(l.tasks),
    }
  ));
  return res.json({ tasklists });
});

// add a new tasklist
router.post('/', async (req, res) => {
  const { body } = req;
  const token = getTokenFrom(req);
  if (!token)
    return res.status(401).json({ error: 'token missing' });
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id)
    return res.status(401).json({ error: 'invalid token' });

  const user = await User.findOne({ where: { id: decodedToken.id } });
  const newList = await Tasklist.create({ name: body.name });
  // const savedList = await newList.save()

  await newList.addUser(user, { through: { description: 'CREATOR' } });
  return res.status(201).json(newList);
});

// get tasks from tasklist
// this starts to become bit hacky...
router.get('/:id/tasks', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access to tasklist' });
  const timeZoneOffset = req.get('time-zone-offset');
  const offsettedTime = time => ((timeZoneOffset && /^-?\d*$/.test(timeZoneOffset))
    ? `DATE_ADD(${time}, INTERVAL ${-timeZoneOffset} MINUTE)`
    : time);
  const [local_NOW, local_completed_at, child_local_completed_at] = ['NOW()', 'task.completed_at', 'childTasks.completed_at'].map(offsettedTime);
  const tasks = await Task.findAll({
    where: {
      tasklistId: req.params.id,
    },
    include: {
      model: ChildTask,
      attributes: {
        include: [
          [sequelize.literal(`DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency), ${local_NOW})`), 'daysLeft'],
          [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency - task.before_flexibility), ${local_NOW}))`), 'earliest'],
          [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency + task.after_flexibility), ${local_NOW})) / frequency`), 'latest'],
          [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${child_local_completed_at}, task.frequency + task.after_flexibility), ${local_NOW}))`), 'timeLeft'],
        ],
      },
      // order: [
      // [ChildTask, 'latest', 'ASC']],
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
      ['latest', 'ASC'],
      ['earliest', 'ASC'],
      ['daysLeft', 'ASC'],
      ['timeLeft', 'ASC'],
      ['daysLeftProportional', 'ASC'],
      [sequelize.literal('`childTasks.latest`'), 'ASC'],
      [sequelize.literal('`childTasks.earliest`'), 'ASC'],
      [sequelize.literal('`childTasks.daysLeft`'), 'ASC'],
      [sequelize.literal('`childTasks.timeLeft`'), 'ASC'],
    ],
  });
  // console.log(tasks);
  return res.status(200).json(tasks);
});

// get fields of tasklist
router.get('/:id', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' });
  const list = await Tasklist.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
      attributes: ['username', 'name'],
      through: {
        attributes: ['description'],
      },
    },

  });
  return res.status(200).json(list);
});

// add new task
router.post('/:id/addtask', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' });
  const { body } = req;
  const newTask = await Task.create({
    name: body.name,
    frequency: body.frequency,
    afterFlexibility: body.afterFlexibility,
    beforeFlexibility: body.beforeFlexibility,
    hasSubtasks: false,
    tasklistId: req.params.id,
    userId: userIdFromRequest(req),
    hasChildTasks: false,
  });
  return res.status(201).json(newTask);
});

router.post('/:id/share', async (req, res) => {
  if (!await canShare(req, req.params.id))
    return res.status(401).json({ error: 'not authorized to share' });
  const { body } = req;
  const newRole = body.role;
  const anotherUsername = body.user;
  if (newRole !== 'EDIT' && newRole !== 'VIEW')
    return res.status(400).json({ error: 'invalid role' });
  const anotherUser = await User.findOne({
    where: {
      username: anotherUsername,
    },
    include: [{
      model: Tasklist,
      through: Role,
      where: { id: req.params.id },
      required: false,
    }],
  });
  if (!anotherUser)
    return res.status(404).json({ error: 'invalid username' });
  if (anotherUser.tasklists.length)
    return res.status(409).json({ error: `"${anotherUsername}" already has access to list` });
  const addedRole = await Role.create({
    description: newRole,
    listId: req.params.id,
    userId: anotherUser.id,
  });
  return res.status(201).json(addedRole);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const list = await Tasklist.findByPk(
    id,
    {
      include: [
        { model: ShoppingListSection, required: false },
        { model: Task, required: false },
      ],
    },
  );
  if (!list)
    return res.status(404).json({ error: 'invalid list id' });

  if (!await canDelete(req, id))
    return res.status(401).json({ error: 'not authorized to delete list' });

  if (list.type === 'SHOPPING') {
    ShoppingListItem.destroy({
      where: { sectionId: list.shoppingListSections.map(section => section.dataValues.id) },
    });
    ShoppingListSection.destroy({ where: { listId: id } });
  } else {
    ChildTask.destroy({ where: { parentId: list.tasks.map(task => task.dataValues.id) } });
    Task.destroy({ where: { tasklistId: id } });
  }

  await list.destroy();
  return res.status(204).send();
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const list = await Tasklist.findByPk(id);
  if (!list)
    return res.status(404).json({ error: 'invalid list id' });
  if (!hasAccess(req, id))
    return res.status(401).json({ error: 'no access' });
  const { name } = req.body;
  if (!name)
    return res.status(401).json({ error: 'no data to update' });
  await Tasklist.update({ name }, { where: { id } });
  return res.status(201).json({ name });
});

module.exports = router;
