import { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import { useDispatch } from 'react-redux';
import taskService from '../../services/task';
import AddTask from '../AddTask';
import EditTask from './EditTask';
import TaskTimeInfo from './TaskTimeInfo';
import TaskMenuButton from './TaskMenuButton';
import FloatingForm from '../FloatingForm';
import { newToast } from '../../reducers/toastReducer';
import './TaskCard.css';
import MoveTask from './MoveTask';
import ChildTasks from './ChildTasks';
import AddChildren from './AddChildren';

const TaskCard = ({
  task, updateTask, tasklistId, appendTask, hideUnknown,
}) => {
  const [copy, setCopy] = useState(false);
  const [style, setStyle] = useState('idle');
  const [done, setDone] = useState(false);
  const [update, setUpdate] = useState(false);
  const [move, setMove] = useState(false);
  const [addChildren, setAddChildren] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
    hasChildTasks,
    childTasks,
  } = task;

  const deleteTask = () => {
    taskService.deleteTask(id)
      .then(() => {
        setStyle(`${style} deleted`);
        dispatch(newToast({ msg: `${name} poistettu`, type: 'info' }));
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
            daysLeft: data.frequency,
            ...data,
          });
          setStyle('checked');
        }, 1000);
      })
      .catch(error => {
        if (error.code === 'ERR_NETWORK') {
          const now = Date.now();
          setStyle(`${style} completed`);
          dispatch(newToast({ msg: 'Ei verkkoyhteyttä', type: 'info' }));
          setTimeout(() => {
            updateTask(id, {
              ...task,
              justCompleted: true,
              completedAt: new Date(now).toISOString(),
              earliest: frequency - beforeFlexibility,
              latest: frequency + afterFlexibility,
              daysLeft: frequency,
            });
            setStyle('checked');
          }, 1000);
        } else if (error.error)
          dispatch(newToast({ msg: error.error }));
      });
  };

  useEffect(() => {
    let newStyle = '';
    if (justCompleted)
      newStyle = 'checked';
    else if (latest === null)
      newStyle = 'unknown';
    else if (latest < 0)
      newStyle = 'late';
    else if (daysLeft === 0)
      newStyle = 'due';
    else if (daysLeft < 0)
      newStyle = 'due-over';
    else if (earliest === 0)
      newStyle = 'early';
    else
      newStyle = 'idle';
    if (timeLeft === 0)
      newStyle = `${newStyle} today`;
    if (hasChildTasks && childTasks.some(child => !child.completedAt))
      newStyle = `${newStyle} unknown-child`;
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

  return (<>
    <div className={`task-card ${style}`} style={hideUnknown && latest === null ? { display: 'none' } : {}}>
      <div className='task-header'>
        <TaskTimeInfo
          afterFlexibility={afterFlexibility}
          beforeFlexibility={beforeFlexibility}
          nextDeadline={nextDeadline}
          daysLeft={daysLeft}
        />
        <TaskMenuButton
          setUpdate={setUpdate}
          setCopy={setCopy}
          setMove={setMove}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          setAddChildren={setAddChildren}
         />
      </div>
      <div className="task-body">
        <div style={{ width: '100%' }}>
          <span className='task-name'> {name}</span>
          {hasChildTasks
            ? <ChildTasks
                childTasks={childTasks}
                updateParent={updateTask}
                parentId={id}
                hideUnknown={hideUnknown} />
            : ''}
        </div>

        {!hasChildTasks
          ? <div className="done-button-wrapper" >
            <button
              className="done-button"
              onClick={() => setDone(true)/* markAsDone */}
            >
              <DoneIcon />
            </button>
          </div>
          : ''}
      </div>
    </div>
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
              <EditTask task={task} update={updateTask} setVisibility={setUpdate} />
            </FloatingForm>
          }
    {move && <FloatingForm setVisibility={setMove}>
      <MoveTask task={task} update={updateTask} />
      <button onClick={() => setMove(false)}> peruuta </button>
    </FloatingForm>}
    {showDeleteConfirmation
        && <FloatingForm setVisibility={setShowDeleteConfirmation}>
          <h2>Poistetaan ”{name}”</h2>
          <button onClick={() => setShowDeleteConfirmation(false)}>peruuta</button>
          <button onClick={() => { deleteTask(); setShowDeleteConfirmation(false); }}>
            poista
          </button>
        </FloatingForm>}
    {addChildren
      && <FloatingForm setVisibility={setAddChildren}>
        <AddChildren task={task} update={updateTask} setVisibility={setAddChildren} />
        <button onClick={() => setAddChildren(false)}>peruuta</button>
      </FloatingForm>
    }
  </>
  );
};

export default TaskCard;
