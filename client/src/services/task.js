import axios from 'axios';
import { config, baseUrl } from './api';

const newTask = (tasklistId, task) => {
  const request = axios.post(
    `${baseUrl}/tasklists/${tasklistId}/addtask`,
    task,
    config(),
  );
  return request.then(res => res.data);
};

const markAsDone = taskId => {
  const request = axios.post(
    `${baseUrl}/task/${taskId}/done`,
    {},
    config(),
  );
  return request.then(res => res.data);
};

const deleteTask = id => {
  const request = axios.delete(
    `${baseUrl}/task/${id}`,
    config(),
  );
  return request.then(res => res);
};

const editTask = (id, newValues) => {
  const request = axios.patch(`${baseUrl}/task/${id}`, newValues, config());
  return request.then(res => res);
};

const moveTask = (id, newListId) => {
  const request = axios.patch(`${baseUrl}/task/${id}/move`, { newListId }, config());
  return request.then(res => res);
};

const markChildAsDone = childTaskId => {
  const request = axios.post(`${baseUrl}/task/child/${childTaskId}/done`, {}, config());
  return request.then(res => res);
};

const createChildren = (id, children) => {
  const request = axios.post(
    `${baseUrl}/task/${id}/children`,
    { childTasks: children },
    config(),
  );
  return request.then(res => res.data);
};

const convertToChild = (childId, parentId) => {
  const request = axios.post(
    `${baseUrl}/task/${childId}/tochild`,
    { newParentId: parentId },
    config(),
  );
  return request
    .then(res => res.data)
    .catch(({ response }) => { throw response.data; });
};

const taskService = {
  newTask,
  markAsDone,
  deleteTask,
  editTask,
  moveTask,
  markChildAsDone,
  createChildren,
  convertToChild,
};

export default taskService;
