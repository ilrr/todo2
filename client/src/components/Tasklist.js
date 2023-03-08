import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import tasklist from "../services/tasklist"
import ShareIcon from '@mui/icons-material/Share';
import tasklistService from '../services/tasklist';
import FloatingForm from './FloatingForm';
import AddTask from './AddTask';
import Share from './Share';
import TaskCard from './TaskCard';

const Tasklist = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [tasks, setTasks] = useState([]);
  const [tasklist, setTasklist] = useState({});
  const [edit, setEdit] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const navigate = useNavigate();

  const appendTask = task => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (id, data) => {
    setTasks(tasks.filter(task => !(task.id === id)).concat(data.delete ? [] : data));
  };

  useEffect(() => {
    if (userInfo.token) {
      let listInfo;
      tasklistService.getTasklistInfo(listId)
        .then(list => { setTasklist(list); listInfo = list; })
        .then(() => {
          if (listInfo.type !== 'SHOPPING') tasklistService.getTasks(listId).then(setTasks);
          else navigate(`/ostoslista/${listId}`);
        })
        .catch(e => navigate('/error', { state: e }));
    }
  }, [userInfo.token, listId]);

  return (
    <div>
      {userInfo.token ? (
        <div className="tasklist">
          <h1>{tasklist.name} <span style={{ cursor: 'pointer' }} onClick={() => setShowShare(true)}><ShareIcon htmlColor='darkslategray' /> </span></h1>
          {tasks
            .filter(({ timeLeft }) => timeLeft === 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                edit={edit}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          <div className="today-separator" style={{ display: tasks[0] ? 'block' : 'none' }} />
          {tasks
            .filter(({ timeLeft }) => timeLeft !== 0)
            .map(task => (
              <TaskCard
                task={task}
                updateTask={updateTask}
                key={task.id}
                edit={edit}
                tasklistId={listId}
                appendTask={appendTask}
              />
            ))}
          <div style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => setShowNewTaskForm(true)}>Lisää uusi tehtävä</div>
          {showNewTaskForm
            && <FloatingForm setVisibility={setShowNewTaskForm}>
              <h2>Luo uusi tehtävä</h2>
              <AddTask
                tasklistId={listId}
                appendTask={appendTask}
                setShowForm={setShowNewTaskForm} />
            </FloatingForm>}

          {showShare
            && <FloatingForm setVisibility={setShowShare}>
              <Share listId={listId} />
            </FloatingForm>}
        </div>
      ) : (
        'Kirjaudu!'
      )}
    </div>
  );
};

export default Tasklist;
