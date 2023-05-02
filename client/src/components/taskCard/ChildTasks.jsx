/* eslint-disable max-len */
import './ChildTask.css';
import DoneIcon from '@mui/icons-material/Done';
// import StartIcon from '@mui/icons-material/Start';
// import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { useEffect, useRef, useState } from 'react';
import taskService from '../../services/task';
import { dateToStringCompact } from '../../util/dateUtils.tsx';

const ChildStatus = ({ childTask, parentTask }) => {
  const nextDeadline = childTask.completedAt
    ? new Date(new Date(childTask.completedAt).valueOf() + 1000 * 60 * 60 * 24 * parentTask.frequency)
    : null;

  // console.log(nextDeadline);
  return <span className='child-task-time-info'>
    <span>{dateToStringCompact(nextDeadline, -parentTask.beforeFlexibility)}</span>
    <span>|</span>
    <span>{dateToStringCompact(nextDeadline, 0)}</span>
    <span>|</span>
    <span>{dateToStringCompact(nextDeadline, parentTask.afterFlexibility)}</span>
  </span>;
};
const ChildTasks = ({
  childTasks, updateParent, parentId, hideUnknown, parent,
}) => {
  const getStatus = ({
    latest, daysLeft, earliest, timeLeft,
  }) => {
    let newStyle = '';
    if (latest === null)
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
    return newStyle;
  };

  const markAsDone = id => {
    taskService.markChildAsDone(id)
      .then(({ data }) => {
        updateParent(parentId, {
          justCompleted: true,
          ...data,
        });
      });
  };

  const [nameWidth, setNameWidth] = useState(undefined);

  const ref = useRef();
  useEffect(() => {
    const maxW = Array.from(ref.current.children).reduce((a, { firstChild }) => (firstChild.offsetWidth > a ? firstChild.offsetWidth : a), 0);
    setNameWidth(maxW + 5);
  }, []);

  return <div className='child-task-list' ref={ref}>
    {childTasks.map((child => (hideUnknown && child.latest === null
      ? ''
      : <div key={child.id} className={`child-task ${getStatus(child)}`} >
        <span className='child-task-name' style={{ width: nameWidth }}>{child.name}</span>
        {child.completedAt && <ChildStatus childTask={child} parentTask={parent} />}
        <div className='done-button-wrapper'>
          <button className='done-button' onClick={event => { event.preventDefault(); markAsDone(child.id); }}>
            <DoneIcon />
          </button>
        </div>
      </div>)))}
  </div>;
};

export default ChildTasks;
