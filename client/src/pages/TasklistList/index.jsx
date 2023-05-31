import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddTaskList from '../../components/AddTasklist';
import TasklistCard from './TasklistCard';
import './TasklistList.css';
import tasklistService from '../../services/tasklist';
import { newToast } from '../../reducers/toastReducer';

const TasklistList = () => {
  const [tasklists, setTasklists] = useState([]);
  const userInfo = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo.token) {
      tasklistService
        .getTasklists()
        .then(lists => setTasklists(lists.tasklists))
        .catch(error => {
          if (error.error && (error.error === 'invalid token' || error.error === 'token expired'))
            navigate('/logout/expired');
          else
            dispatch(newToast(error.error));
        });
    }
  }, [userInfo.token]);

  const [showNewListForm, setShowNewListForm] = useState(false);
  if (userInfo.username) {
    return <div className='task-list-list'>
      {tasklists.map(tasklist => <TasklistCard tasklist={tasklist} key={tasklist.id} />)}
      <div className='list-card new' onClick={() => { setShowNewListForm(true); }}>+</div>
      {showNewListForm ? <AddTaskList setShowNewListForm={setShowNewListForm} /> : ''}
    </div>;
  }
  return <>Kirjaudu sisään!</>;
};

export default TasklistList;
