import AddTaskList from './AddTasklist';
import TasklistCard from './TasklistCard';

const TasklistList = ({ tasklists }) => (
    <div>
      {tasklists.map(tasklist => <TasklistCard tasklist={tasklist} key={tasklist.id} />)}
      <AddTaskList />
    </div>
);

export default TasklistList;
