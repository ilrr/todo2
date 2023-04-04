import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import tasklistService from '../services/tasklist';
import TasklistList from './TasklistList';
import { newToast } from '../reducers/toastReducer';

const Tasklists = () => {
  // const dispatch = useDispatch()
  // const user = useSelector({ user })
  // const token=user.token

  const [tasklists, setTasklists] = useState([]);

  const userInfo = useSelector(({ user }) => user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // console.log(userInfo)
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
  // console.log(tasklists);

  return (
    <div>
      {userInfo.username ? <TasklistList tasklists={tasklists} /> : 'Kirjaudu sisään!'}
    </div>
  );
};

export default Tasklists;
