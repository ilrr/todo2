import { config, baseUrl } from "./api"

import axios from "axios"

const newTask = (tasklistId, task) => {
  const request = axios.post(
    `${baseUrl}/tasklists/${tasklistId}/addtask`,
    task,
    config()
  )
  return request.then(res => res.data)
}

const markAsDone = (taskId) => {
  const request = axios.post(
    `${baseUrl}/task/${taskId}/done`,
    {},
    config()
  )
  return request.then(res => res.data)
}

const deleteTask = (id) => {
  const request = axios.delete(
    `${baseUrl}/task/${id}`,
    config()
  )
  return request.then(res=>res)
}

export default {newTask, markAsDone, deleteTask}