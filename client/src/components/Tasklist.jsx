import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import tasklist from "../services/tasklist"
import ShareIcon from '@mui/icons-material/Share';
import tasklistService from '../services/tasklist';
import FloatingForm from './FloatingForm';
import AddTask from './AddTask';
import Share from './Share';
import TaskCard from './taskCard/TaskCard';
import DeleteListButton from './DeleteListButton';
import './Tasklist.css';

const Tasklist = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [tasks, setTasks] = useState([]);
  const [tasklist, setTasklist] = useState({});
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const navigate = useNavigate();

  const appendTask = task => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (id, data) => {
    console.log(data);
    setTasks(tasks
      .filter(task => !(task.id === id))
      .concat(data.delete ? [] : data)
      .slice()
      .sort((a, b) => (
        a.latest - b.latest
        || a.earliest - b.earliest
        || a.daysLeft - b.daysLeft
        || a.timeLeft - b.timeLeft
      )));
  };

  useEffect(() => {
    if (userInfo.token) {
      let listInfo;
      tasklistService
        .getTasklistInfo(listId)
        .then(list => {
          setTasklist(list);
          listInfo = list;
        })
        .then(() => {
          if (listInfo.type !== 'SHOPPING')
            tasklistService.getTasks(listId).then(setTasks);
          else
            navigate(`/ostoslista/${listId}`);
        })
        .catch(error => navigate('/error', { state: error }));
    }
  }, [userInfo.token, listId]);

  return (
    <div>
      {userInfo.token ? (
        <div className="tasklist">
          <h1>
            {tasklist.name}{' '}
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => setShowShare(true)}>
              <ShareIcon htmlColor="darkslategray" />
            </span>
            <DeleteListButton listId={listId} />
          </h1>
          {tasks
            .filter(({ timeLeft }) => timeLeft === 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          <div
            className="today-separator"
            style={{ display: tasks[0] ? 'block' : 'none' }} />
          {tasks
            .filter(({ timeLeft }) => timeLeft !== 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          <div
            style={{ textAlign: 'center', fontSize: 24, padding: '10px 0' }}
            className="task-card new"
            onClick={() => setShowNewTaskForm(true)}
          >
            +
          </div>
          {showNewTaskForm && (
            <FloatingForm setVisibility={setShowNewTaskForm}>
              <h2>Luo uusi tehtävä</h2>
              <AddTask
                tasklistId={listId}
                appendTask={appendTask}
                setShowForm={setShowNewTaskForm}
              />
            </FloatingForm>
          )}

          {showShare && (
            <FloatingForm setVisibility={setShowShare}>
              <Share listId={listId} />
            </FloatingForm>
          )}
        </div>
      ) : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default Tasklist;
