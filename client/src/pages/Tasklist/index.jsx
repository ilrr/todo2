import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import tasklist from "../services/tasklist"
import ShareIcon from '@mui/icons-material/Share';
import tasklistService from '../../services/tasklist';
import Modal from '../../components/Modal';
import AddTask from './AddTask';
import Share from '../../components/Share';
import TaskCard from './TaskCard';
import DeleteListButton from '../../components/DeleteListButton';
import './Tasklist.css';
import ListOptionsBar from '../../components/ListOptionBar';

const Tasklist = () => {
  const { listId } = useParams();
  const userInfo = useSelector(({ user }) => user);
  const [tasks, setTasks] = useState([]);
  const [tasklist, setTasklist] = useState({});
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [hideUnknown, sethideUnknown] = useState(false);

  const navigate = useNavigate();

  const appendTask = task => {
    setTasks([task, ...tasks]);
  };

  const updateTask = (id, data) => {
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
    <>
      {userInfo.token ? (<>
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
                siblings={tasks}
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
                hideUnknown={hideUnknown}
                siblings={tasks}
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
            <Modal setVisibility={setShowNewTaskForm}>
              <h2>Luo uusi tehtävä</h2>
              <AddTask
                tasklistId={listId}
                appendTask={appendTask}
                setShowForm={setShowNewTaskForm}
              />
            </Modal>
          )}

          {showShare && (
            <Modal setVisibility={setShowShare}>
              <Share listId={listId} />
            </Modal>
          )}
        </div>
        <ListOptionsBar
          labels={['piilota ei vielä suoritetut']}
          actions={[() => sethideUnknown(!hideUnknown)]}
          selected={[hideUnknown]}
          /></>
      ) : (
        'Kirjaudu!'
      )}
    </>
  );
};

export default Tasklist;
