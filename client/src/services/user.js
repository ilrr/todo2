import axios from 'axios';
import { baseUrl } from './api';

const login = fields => {
  const request = axios.post(
    `${baseUrl}/login`,
    fields,
  );
  return request
    .then(res => res.data)
    .catch(error => {
      if (error.response)
        throw error.response.data;
      else
        throw error;
    });
};

const register = fields => {
  const request = axios.post(
    `${baseUrl}/register`,
    fields,
  );
  return request
    .then(res => res.data)
    .catch(error => { throw error.response.data; });
};

const userService = { login, register };
export default userService;
