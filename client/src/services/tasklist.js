import axios from 'axios';
import { config, baseUrl } from './api';

const getTasklists = () => {
  const request = axios.get(`${baseUrl}/tasklists`, config());
  return request
    .then(res => res.data)
    .catch(e => { throw e.response.data; });
};

const getTasks = id => {
  const request = axios.get(`${baseUrl}/tasklists/${id}/tasks`, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const getTasklistInfo = id => {
  const request = axios.get(`${baseUrl}/tasklists/${id}`, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const newList = name => {
  const request = axios.post(`${baseUrl}/tasklists`, { name }, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const shareList = (listId, username) => {
  const request = axios.post(
    `${baseUrl}/tasklists/${listId}/share`,
    {
      user: username,
      role: 'EDIT',
    },
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const deleteList = listId => {
  const request = axios.delete(
    `${baseUrl}/tasklists/${listId}`,
    config(),
  );
  return request.then(res => res.status).catch(e => { throw e.response.data; });
};

const tasklistService = {
  getTasklists,
  getTasks,
  getTasklistInfo,
  newList,
  shareList,
  deleteList,
};

export default tasklistService;
