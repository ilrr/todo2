import { useState } from 'react';
import AddTaskList from './AddTasklist';
import TasklistCard from './TasklistCard';
import './TasklistList.css';

const TasklistList = ({ tasklists }) => {
  const [showNewListForm, setShowNewListForm] = useState(false);
  return <div>
      {tasklists.map(tasklist => <TasklistCard tasklist={tasklist} key={tasklist.id} />)}
      <div className='list-card new' onClick={() => { setShowNewListForm(true); }}>+</div>
      {showNewListForm ? <AddTaskList setShowNewListForm={setShowNewListForm} /> : ''}
    </div>;
};

export default TasklistList;
