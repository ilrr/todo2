const User = require('./index');
const Tasklist = require('./index');
const Task = require('./index');
const Subtask = require('./index');
const Role = require('./index');

User.sync({ alter: true });
Tasklist.sync({ alter: true });
Task.sync({ alter: true });
Subtask.sync({ alter: true });
Role.sync({ alter: true });
