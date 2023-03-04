const User = require('./user');
const Tasklist = require('./tasklist');
const Task = require('./task');
const Subtask = require('./subtask');
const Role = require('./role');
const ShoppingListSection = require('./shoppingListSection');
const ShoppingListItem = require('./shoppingListItem');

Tasklist.hasMany(Task);
Task.belongsTo(Tasklist, { foreignKey: 'tasklistId' });

User.hasMany(Task);
Task.belongsTo(User, { foreignKey: 'completedBy' });

Task.hasMany(Subtask);
Subtask.belongsTo(Task, { foreignKey: 'parentId' });
User.hasMany(Subtask);
Subtask.belongsTo(User, { foreignKey: 'completedBy' });

Tasklist.belongsToMany(User, { through: Role, foreignKey: 'listId' });
User.belongsToMany(Tasklist, { through: Role, foreignKey: 'userId' });

Tasklist.hasMany(ShoppingListSection, { foreignKey: 'listId' });
ShoppingListSection.belongsTo(Tasklist, { foreignKey: 'listId' });

ShoppingListSection.hasMany(ShoppingListItem, { foreignKey: 'sectionId' });
ShoppingListItem.belongsTo(ShoppingListSection, { foreignKey: 'sectionId' });

// Tasklist.sync({ alter: false });
// ShoppingListSection.sync({ alter: false });
// ShoppingListItem.sync({ alter: false });
/*
User.sync({ alter: true })
Tasklist.sync({ alter: true })
Task.sync({ alter: true })
Subtask.sync({ alter: true })
Role.sync({ alter: true })
*//*
User.sync({ alter: false });
Tasklist.sync({ alter: false });
Task.sync({ alter: false });
Subtask.sync({ alter: false });
Role.sync({ alter: false });
*/

module.exports = {
  User, Tasklist, Task, Subtask, Role, ShoppingListItem, ShoppingListSection,
};
