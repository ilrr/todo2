import { Link } from 'react-router-dom';

const TasklistCard = ({ tasklist }) => {
  const shopping = tasklist.type === 'SHOPPING';
  return (
    <>
      <Link to={`/${shopping ? 'ostos' : ''}lista/${tasklist.id}`}>
        <div className={`list-card ${shopping ? 'shopping-l' : 'task-l'}`}>
          {tasklist.name}
        </div>
      </Link>
    </>
  );
};

export default TasklistCard;
