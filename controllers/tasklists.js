const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { fn } = require('sequelize')

const { Tasklist, User, Role, Task } = require('../models')
const { sequelize } = require('../util/db')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer'))
    return authorization.substring(7)
  return null
}

const hasAccess = async (req, tasklistId) => {
  const token = getTokenFrom(req)
  if (!token) return false
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken) return false
  const role = await Role.findOne({
    where: {
      userId: decodedToken.id,
      listId: tasklistId
    }
  })
  return !!role
}

const canShare = async (req, tasklistId) => {
  const token = getTokenFrom(req)
  if (!token) return false
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken) return false
  const role = await Role.findOne({
    where: {
      userId: decodedToken.id,
      listId: tasklistId,
      description: 'CREATOR'
    }
  })
  return !!role
}

const userIdFromRequest = req => {
  const token = getTokenFrom(req)
  decodedToken = jwt.verify(token, process.env.SECRET)
  return decodedToken.id
}

// get tasklists of user
router.get('/', async (req, res) => {

  const token = getTokenFrom(req)
  if (!token) return res.status(401).json({ error: 'token missing' })
  decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: "invalid token" })


  const lists = await User.findOne({
    where: {
      id: decodedToken.id
    },
    include: {
      model: Tasklist
    },
    attributes: { exclude: ['password'] }
  })
  res.json(lists)
})

// add a new tasklist
router.post('/', async (req, res) => {
  const body = req.body
  const token = getTokenFrom(req)
  if (!token) return res.status(401).json({ error: 'token missing' })
  decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) return res.status(401).json({ error: "invalid token" })

  const user = await User.findOne({ where: { id: decodedToken.id } })
  const newList = await Tasklist.create({ name: body.name })
  //const savedList = await newList.save()

  await newList.addUser(user, { through: { description: 'CREATOR' } })
  res.status(201).json(newList)
})

//get tasks from tasklist
router.get('/:id/tasks', async (req, res) => {
  if (! await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access to tasklist' })
  const timeZoneOffset = req.get("time-zone-offset") 
  const offsettedTime = time => (timeZoneOffset && /^-?\d*$/.test(timeZoneOffset))
    ? `DATE_ADD(${time}, INTERVAL ${-timeZoneOffset} MINUTE)`
    : time
  const [local_NOW, local_completed_at] = ['NOW()', 'completed_at'].map(offsettedTime)
  const tasks = await Task.findAll({
    where: {
      tasklistId: req.params.id,
    },
    attributes: {
      include: [
        [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})`), 'daysLeft'],
        [sequelize.literal(`EXTRACT(HOUR FROM (TIMEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW})))`), 'hoursLeft'],
        [sequelize.literal(`DATEDIFF(ADDDATE(${local_completed_at}, frequency), ${local_NOW}) / frequency`), 'daysLeftProportional'],
        [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency - before_flexibility), ${local_NOW}))`), 'earliest'],
        [sequelize.literal(`LEAST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency + after_flexibility), ${local_NOW})) / frequency`), 'latest'],
        [sequelize.literal(`GREATEST(0, DATEDIFF(ADDDATE(${local_completed_at}, frequency + after_flexibility), ${local_NOW}))`), 'timeLeft'],
      ]
    },
    order: [

      ['latest', 'ASC'],
      ['earliest', 'ASC'],
      ['timeLeft', 'ASC'],
      ['daysLeft', 'ASC'],
      ['daysLeftProportional', 'ASC']
    ]
  })
  //console.log(tasks);
  return res.status(200).json(tasks)
})

//get fields of tasklist
router.get('/:id', async (req, res) => {
  if (! await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' })
  const list = await Tasklist.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: User,
      attributes: ['username', 'name'],
      through: {
        attributes: ['description']
      }
    }

  })
  return res.status(200).json(list)
})

//add new task
router.post('/:id/addtask', async (req, res) => {
  if (! await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' })
  const body = req.body
  const newTask = await Task.create({
    name: body.name,
    frequency: body.frequency,
    afterFlexibility: body.afterFlexibility,
    beforeFlexibility: body.beforeFlexibility,
    hasSubtasks: false,
    tasklistId: req.params.id,
    userId: userIdFromRequest(req)
  })
  return res.status(201).json(newTask)
})

router.post('/:id/share', async (req, res) => {
  if (!await canShare(req, req.params.id))
    return res.status(401).json({ error: 'not authorized to share' })
  const body = req.body
  const newRole = body.role
  const anotherUsername = body.user
  if (newRole !== 'EDIT' && newRole !== 'VIEW')
    return res.status(400).json({ error: 'invalid role' })
  const anotherUser = await User.findOne({
    where: {
      username: anotherUsername
    }
  })
  if (!anotherUser)
    return res.status(404).json({ error: 'invalid username' })
  addedRole = await Role.create({
    description: newRole,
    listId: req.params.id,
    userId: anotherUser.id
  })
  return res.status(201).json(addedRole)

})

module.exports = router