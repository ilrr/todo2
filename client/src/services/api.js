export const baseUrl = process.env.NODE_ENV === 'development'
  ? 'http://192.168.1.120:3001/api'
  : '/api';

let token = null;

export const config = () => ({
  headers: {
    authorization: token,
    'time-zone-offset': new Date().getTimezoneOffset(),
  },
});

export const setToken = newToken => {
  token = `bearer ${newToken}`;
};
