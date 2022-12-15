import AddTaskList from "./AddTasklist"
import TasklistCard from "./TasklistCard"

const TasklistList = ({ tasklists }) => {

  return (
    <div>
      {tasklists.map(tasklist => <TasklistCard tasklist={tasklist} key={tasklist.id} />)}
      <AddTaskList />
    </div>
  )
}

export default TasklistList