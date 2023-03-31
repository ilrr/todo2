import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import TaskMenu from './TaskMenu';
import './TaskMenu.css';

const TaskMenuButton = props => {
  const {
    setCopy, setUpdate, deleteTask, name, setMove,
  } = props;

  const [showMenu, setShowMenu] = useState(false);

  return <div className={`task-menu ${showMenu ? 'active' : ''}`}>
    <div onClick={() => setShowMenu(!showMenu)} className="task-menu-button">
      {showMenu ? <CloseIcon /> : <MenuIcon />}
    </div>
    {showMenu
      && <TaskMenu
        setCopy={setCopy}
        setUpdate={setUpdate}
        deleteTask={deleteTask}
        name={name}
        setMove={setMove}
        setShowMenu={setShowMenu}
    />}
  </div>;
};

export default TaskMenuButton;
