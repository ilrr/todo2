import axios from 'axios';
import { config, baseUrl } from './api';

const newTask = async (tasklistId, task) => {
  const request = axios.post(
    `${baseUrl}/tasklists/${tasklistId}/addtask`,
    task,
    config(),
  );
  const res = await request;
  return res.data;
};

const markAsDone = async taskId => {
  const request = axios.post(
    `${baseUrl}/task/${taskId}/done`,
    {},
    config(),
  );
  const res = await request;
  return res.data;
};

const deleteTask = async id => {
  const request = axios.delete(
    `${baseUrl}/task/${id}`,
    config(),
  );
  const res = await request;
  return res;
};

const editTask = async (id, newValues) => {
  const request = axios.patch(`${baseUrl}/task/${id}`, newValues, config());
  const res = await request;
  return res;
};

const moveTask = async (id, newListId) => {
  const request = axios.patch(`${baseUrl}/task/${id}/move`, { newListId }, config());
  const res = await request;
  return res;
};

const markChildAsDone = async childTaskId => {
  const request = axios.post(`${baseUrl}/task/child/${childTaskId}/done`, {}, config());
  const res = await request;
  return res;
};

const createChildren = async (id, children) => {
  const request = axios.post(
    `${baseUrl}/task/${id}/children`,
    { childTasks: children },
    config(),
  );
  const res = await request;
  return res.data;
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
