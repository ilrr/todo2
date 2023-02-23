import { useEffect, useState } from 'react';
import taskService from '../services/task';
import AddTask from './AddTask';
import EditTask from './EditTask';
import TaskTiming from './TaskTiming';

const TaskCard = ({
  task, updateTask, edit, tasklistId, appendTask,
}) => {
  const [copy, setCopy] = useState(false);
  const [style, setStyle] = useState('idle');
  const [done, setDone] = useState(false);
  const [update, setUpdate] = useState(false);

  const toDate = date => Date.UTC(date.getYear(), date.getMonth(), date.getDate());

  const dateToString = date => {
    // console.log(date);
    if (!date) return 'Ei vielä suoritettu';
    const now = new Date(Date.now());
    // console.log(now);
    const dMonth = (date.getYear() - now.getYear()) * 12
      + (date.getMonth() - now.getMonth())
      + (date.getDate() - now.getDate()) / 30;
    if (dMonth >= 1) return `${Math.floor(dMonth)} kuukauden päästä`;
    if (dMonth <= -1) return `${Math.floor(-dMonth)} kuukautta sitten`;
    const timeString = `klo ${date.toLocaleTimeString()}`;
    const dDay = (toDate(date) - toDate(now)) / (1000 * 60 * 60 * 24);
    if (dDay === 0) return `tänään ${timeString}`;
    if (dDay === 1) return `huomenna ${timeString}`;
    if (dDay === -1) return `eilen ${timeString}`;
    if (dDay >= 0) return `${dDay} päivän päästä`;
    if (dDay < 0) return `${-dDay} päivää sitten`;
    return 'outo juttu :|';
  };

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
      .catch(alert);
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
      .catch(e => alert(e));
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
    setStyle('white');
    setStyle(newStyle);
  }, []);

  useEffect(() => {
    if (done) {
      setDone(false);
      markAsDone();
    }
  }, [done]);

  return (
    <div className={`task-card ${style}`}>
      <TaskTiming
        freq={frequency}
        bFlex={beforeFlexibility}
        aFlex={afterFlexibility}
        lastTD={completedAt}
      />
      <div className="task-body">
        <div>
          {name}

          {edit
            ? <div className="edit">
              <button onClick={() => setCopy(!copy)}>kopioi</button>
              <button onClick={deleteTask}>poista</button>
              <button onClick={() => setUpdate(!update)}>muokkaa</button>
              {copy
                ? <div>
                  <AddTask
                    appendTask={appendTask}
                    tasklistId={tasklistId}
                    presets={{
                      name, frequency, afterFlexibility, beforeFlexibility,
                    }}
                  />
                  <button onClick={() => setCopy(false)}> peruuta </button>
                </div>
                : ''}

              {update
                ? <EditTask task={task} update={updateTask} />
                : ''}
            </div>
            : ''
          }
        </div>

        <div className="done-button-wrapper">
          <button className="done-button"
            onClick={() => setDone(true)/* markAsDone */}
          >

          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
