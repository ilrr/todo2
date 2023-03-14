import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch } from 'react-redux';
import taskService from '../services/task';
import AddTask from './AddTask';
import EditTask from './EditTask';
import TaskTimeInfo from './TaskTimeInfo';
import TaskMenuButton from './TaskMenuButton';
import FloatingForm from './FloatingForm';
import { newToast } from '../reducers/toastReducer';

const TaskCard = ({
  task, updateTask, tasklistId, appendTask,
}) => {
  const [copy, setCopy] = useState(false);
  const [style, setStyle] = useState('idle');
  const [done, setDone] = useState(false);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();

  const {
    name,
    id,
    completedAt,
    frequency,
    afterFlexibility,
    beforeFlexibility,
    earliest,
    latest,
    daysLeft,
    justCompleted,
    timeLeft,
  } = task;

  const deleteTask = () => {
    taskService.deleteTask(id)
      .then(() => {
        setStyle(`${style} deleted`);
        setTimeout(() => {
          updateTask(id, { delete: true });
        }, 1000);
      })
      .catch(({ error }) => dispatch(newToast({ msg: error })));
  };

  const markAsDone = () => {
    taskService.markAsDone(id)
      .then(data => {
        setStyle(`${style} completed`);
        setTimeout(() => {
          updateTask(id, {
            justCompleted: true,
            ...data,
          });
          setStyle('checked');
        }, 1000);
      })
      .catch(({ error }) => dispatch(newToast({ msg: error })));
  };

  useEffect(() => {
    let newStyle = '';
    if (justCompleted) newStyle = 'checked';
    else if (latest === null) newStyle = 'unknown';
    else if (latest < 0) newStyle = 'late';
    else if (daysLeft === 0) newStyle = 'due';
    else if (daysLeft < 0) newStyle = 'due-over';
    else if (earliest === 0) newStyle = 'early';
    else newStyle = 'idle';
    if (timeLeft === 0) newStyle = `${newStyle} today`;
    setStyle(newStyle);
  }, []);

  useEffect(() => {
    if (done) {
      setDone(false);
      markAsDone();
    }
  }, [done]);

  const nextDeadline = completedAt
    ? new Date(new Date(completedAt).valueOf() + 1000 * 60 * 60 * 24 * frequency)
    : null;

  return (
    <div className={`task-card ${style}`}>
      <div className='task-header'>
        <TaskTimeInfo
        afterFlexibility={afterFlexibility}
        beforeFlexibility={beforeFlexibility}
        nextDeadline={nextDeadline}
        daysLeft={daysLeft}
        />
        <TaskMenuButton
          setUpdate={setUpdate} setCopy={setCopy} deleteTask={deleteTask} name={name} />
      </div>
      <div className="task-body">
        <div>
          {name}

          {copy
            && <FloatingForm setVisibility={setCopy}>
              <AddTask
                appendTask={appendTask}
                tasklistId={tasklistId}
                presets={{
                  name, frequency, afterFlexibility, beforeFlexibility,
                }}
              />
              <button onClick={() => setCopy(false)}> peruuta </button>
            </FloatingForm>
          }
          {update
            && <FloatingForm setVisibility={setUpdate}>
              <EditTask task={task} update={updateTask} />
            </FloatingForm>
          }
        </div>

        <div className="done-button-wrapper" >
          <button className="done-button"
            onClick={() => setDone(true)/* markAsDone */}
          >
            <DoneIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
