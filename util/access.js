const jwt = require('jsonwebtoken');
const { Role } = require('../models');

const getTokenFrom = req => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer'))
    return authorization.substring(7);
  return null;
};

const hasAccess = async (req, tasklistId) => {
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
    },
  });
  return !!role;
};

module.exports = { getTokenFrom, hasAccess };
