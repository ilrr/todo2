import axios from 'axios';
import { baseUrl, config } from './api';

const getItems = id => {
  const request = axios.get(`${baseUrl}/shopping/${id}/items`, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const newList = name => {
  const request = axios.post(`${baseUrl}/shopping`, { name }, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const getListInfo = id => {
  const request = axios.get(`${baseUrl}/shopping/${id}`, config());
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const newItem = (sectionId, item) => {
  const request = axios.post(
    `${baseUrl}/shopping/section/${sectionId}/additem`,
    item,
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const newSection = (tasklistId, section) => {
  const request = axios.post(
    `${baseUrl}/shopping/${tasklistId}/addsection`,
    section,
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const checkItem = (itemId, checked) => {
  const request = axios.patch(
    `${baseUrl}/shopping/item/${itemId}/check`,
    { checked },
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const checkout = listId => {
  const request = axios.post(
    `${baseUrl}/shopping/${listId}/checkout`,
    {},
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const setColor = (listId, color) => {
  const request = axios.patch(
    `${baseUrl}/shopping/section/${listId}/setcolor`,
    { color },
    config(),
  );
  return request.then(res => res.data).catch(e => { throw e.response.data; });
};

const shoppingListService = {
  getItems, getListInfo, newItem, newSection, checkItem, checkout, newList, setColor,
};
export default shoppingListService;
