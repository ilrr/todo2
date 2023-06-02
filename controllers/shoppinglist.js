const router = require('express').Router();
require('sequelize');
const jwt = require('jsonwebtoken');

const {
  Tasklist, User, ShoppingListSection, ShoppingListItem,
} = require('../models');
const { getTokenFrom, hasAccess } = require('../util/access');
const { sequelize } = require('../util/db');
// const { sequelize } = require('../util/db');

const validateSectionAccess = async (req, res, next) => {
  const { id } = req.params;
  const section = await ShoppingListSection.findOne({ where: { id } });
  if (!section)
    return res.status(403).json({ error: 'invalid id' });
  if (!hasAccess(req, section.listId))
    return res.status(401).json({ error: 'no access' });
  req.section = section;
  req.sectionId = id;
  return next();
};

router.get('/', async (req, res) => {
  const token = getTokenFrom(req);
  if (!token)
    return res.status(401).json({ error: 'token missing' });
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id)
    return res.status(401).json({ error: 'invalid token' });

  const lists = await User.findOne({
    where: {
      id: decodedToken.id,
    },
    include: {
      model: Tasklist,
      where: { type: 'TASK' },
    },
    attributes: { exclude: ['password'] },
  });
  return res.json(lists);
});

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

router.post('/', async (req, res) => {
  const { body } = req;
  const token = getTokenFrom(req);
  if (!token)
    return res.status(401).json({ error: 'token missing' });
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id)
    return res.status(401).json({ error: 'invalid token' });

  const user = await User.findOne({ where: { id: decodedToken.id } });
  const newList = await Tasklist.create({ name: body.name, type: 'SHOPPING' });
  // const savedList = await newList.save()

  await newList.addUser(user, { through: { description: 'CREATOR' } });
  return res.status(201).json(newList);
});

router.get('/:id/items', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' });

  const sections = await ShoppingListSection.findAll({
    where: { listId: req.params.id },
    include: { model: ShoppingListItem },
    order: [['id', 'ASC'], [ShoppingListItem, 'id', 'ASC']],
  });

  return res.status(200).json(sections);
});

router.post('/:id/addsection', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' });
  const { body } = req;
  const newSection = await ShoppingListSection.create({
    name: body.name,
    color: body.color,
    listId: req.params.id,
  });
  return res.status(201).json(newSection);
});

module.exports = router;

router.post('/section/:id/additem', async (req, res) => {
  const section = await ShoppingListSection.findOne({ where: { id: req.params.id } });
  if (!section)
    return res.status(403).json({ error: 'invalid id' });
  if (!hasAccess(req, section.listId))
    return res.status(401).json({ error: 'no access' });
  const { body } = req;
  const newItem = await ShoppingListItem.create({
    name: body.name,
    checked: false,
    sectionId: req.params.id,
  });
  return res.status(201).json(newItem);
});

router.delete('/section/:id', validateSectionAccess, async (req, res) => {
  const id = req.sectionId;
  await ShoppingListItem.destroy({ where: { sectionId: id } });
  await ShoppingListSection.destroy({ where: { id } });
  return res.status(204).send();
});

router.patch('/section/:id', validateSectionAccess, async (req, res) => {
  const { section } = req;
  // console.log(section);
  const id = req.sectionId;
  const { name = section.name } = req.body;
  let {
    color = section.color,
  } = req.body;
  if (color.length > 6) {
    if (color.length === 7 && color[0] === '#')
      color = color.slice(1);
    else
      return res.status(400).json({ error: 'color must be 6 characters long' });
  }
  await ShoppingListSection.update({ name, color }, { where: { id: req.sectionId } });
  const updatedSection = await ShoppingListSection.findByPk(
    id,
    { include: { model: ShoppingListItem } },
  );
  return res.status(201).json(updatedSection);
});

router.patch('/section/:id/setcolor', async (req, res) => {
  const section = await ShoppingListSection.findOne({ where: { id: req.params.id } });
  if (!section)
    return res.status(403).json({ error: 'invalid id' });
  if (!hasAccess(req, section.listId))
    return res.status(401).json({ error: 'no access' });
  const { body } = req;
  let { color } = body;
  if (color.length > 6) {
    if (color.length === 7 && color[0] === '#')
      color = color.slice(1);
    else
      return res.status(400).json({ error: 'color must be 6 characters long' });
  }
  await ShoppingListSection.update(
    { color },
    { where: { id: req.params.id } },
  );
  return res.status(201).json({ color });
});

router.patch('/item/:id/check', async (req, res) => {
  const section = await ShoppingListSection.findOne({
    include: {
      model: ShoppingListItem,
      where: { id: req.params.id },
    },
  });
  const checked = req.body.checked !== undefined ? req.body.checked : true;
  if (!section)
    return res.status(403).json({ error: 'invalid id' });
  const { listId } = section;
  if (!hasAccess(req, listId))
    return res.status(401).json({ error: 'no access' });
  await ShoppingListItem.update(
    { checked },
    { where: { id: req.params.id } },
  );
  const updatedItem = await ShoppingListItem.findByPk(req.params.id);
  return res.status(201).json(updatedItem);
});

router.post('/:id/checkout', async (req, res) => {
  if (!await hasAccess(req, req.params.id))
    return res.status(401).json({ error: 'no access' });
  await sequelize.query(
    `
    DELETE item 
    FROM shopping_list_items AS item
    INNER JOIN shopping_list_sections AS section
    ON item.section_id = section.id
    WHERE section.list_id = :list_id AND item.checked = 1;
    `,
    { replacements: { list_id: req.params.id } },
  );

  const updatedSections = await ShoppingListSection.findAll({
    where: { listId: req.params.id },
    include: { model: ShoppingListItem },
    order: [['id', 'ASC'], [ShoppingListItem, 'id', 'ASC']],
  });

  return res.status(200).json(updatedSections);
});
