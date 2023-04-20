import './ChildTask.css';
import DoneIcon from '@mui/icons-material/Done';
import taskService from '../../services/task';

const ChildTasks = ({
  childTasks, updateParent, parentId, hideUnknown,
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

  return <div className='child-task-list'>
    {childTasks.map((child => (hideUnknown && child.latest === null ? '' : <div key={child.id} className={`child-task ${getStatus(child)}`} >
      {child.name}

      <div className='done-button-wrapper'>
        <button className='done-button' onClick={event => { event.preventDefault(); markAsDone(child.id); }}>
          <DoneIcon />
        </button>
      </div>
    </div>)))}
  </div>;
};

export default ChildTasks;
