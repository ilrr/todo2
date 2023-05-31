import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import TaskMenu from './TaskMenu';
import './TaskMenu.css';

const TaskMenuButton = props => {
  const {
    setCopy, setUpdate, setMove, setShowDeleteConfirmation, setAddChildren, setConvertToChild, task,
  } = props;

  const [showMenu, setShowMenu] = useState(false);

  return <div className={`task-menu ${showMenu ? 'active' : ''}`}>
    <div
      onClick={() => {
        if (!showMenu)
          setShowMenu(true);
      }}
      className="task-menu-button">
      {showMenu ? <CloseIcon /> : <MenuIcon />}
    </div>
    {showMenu
      && <TaskMenu
        task={task}
        setShowMenu={setShowMenu}
        setCopy={setCopy}
        setUpdate={setUpdate}
        setMove={setMove}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        setAddChildren={setAddChildren}
        setConvertToChild={setConvertToChild}
    />}
  </div>;
};

export default TaskMenuButton;
