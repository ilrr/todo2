import axios from 'axios'
import { config, baseUrl } from "./api"

const getTasklists = () => {
  const request = axios.get(
    `${baseUrl}/tasklists`,
    config()
  )
  return request.then(res => res.data)
}

const getTasks = id => {
  const request = axios.get(
    `${baseUrl}/tasklists/${id}/tasks`,
    config()
  )
  return request.then(res => res.data)
}

const getTasklistInfo = id => {
  const request = axios.get(
    `${baseUrl}/tasklists/${id}`,
    config()
  )
  return request.then(res => res.data)
}

const newList = name => {
  const request = axios.post(
    `${baseUrl}/tasklists`,
    { name },
    config()
  )
  return request.then(res => res.data)
}

const shareList = (listId, username) => {
  const request = axios.post(
    `${baseUrl}/tasklists/${listId}/share`,
    {
      user: username,
      role: "EDIT"
    },
    config()
  )
  return request.then(res => res.data)
}

const tasklistService = {
  getTasklists,
  getTasks,
  getTasklistInfo,
  newList,
  shareList,
}

export default tasklistService