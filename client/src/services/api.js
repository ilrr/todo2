export const baseUrl = process.env.NODE_ENV === 'development'
  ? `${/(.*):\d/.exec(window.location.href)[1]}:3001/api` // 'http://192.168.1.120:3001/api'
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
