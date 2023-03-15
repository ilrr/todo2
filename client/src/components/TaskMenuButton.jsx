import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import FloatingForm from './FloatingForm';

const TaskMenu = props => {
  const {
    setCopy, setUpdate, deleteTask, name,
  } = props;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  return (<>
    {showDeleteConfirmation
      && <FloatingForm setVisibility={setShowDeleteConfirmation}>
        <h2>Poistetaan ”{name}”</h2>
        <button onClick={() => setShowDeleteConfirmation(false)}>peruuta</button>
        <button onClick={() => { deleteTask(); setShowDeleteConfirmation(false); }}>poista</button>
      </FloatingForm>}
    <div className='task-menu-content'>
      <div className='task-menu-content-item' onClick={() => setUpdate(true)}> muokkaa </div>
      <div className='task-menu-content-item' onClick={() => setCopy(true)}> kopioi </div>
      <div className='task-menu-content-item' onClick={() => setShowDeleteConfirmation(true)}> poista </div>
    </div>
    </>
  );
};

const TaskMenuButton = props => {
  const {
    setCopy, setUpdate, deleteTask, name,
  } = props;

  const [showMenu, setShowMenu] = useState(false);
  return <div className={`task-menu ${showMenu ? 'active' : ''}`}>
    <div onClick={() => setShowMenu(!showMenu)}>
      {showMenu ? <CloseIcon /> : <MenuIcon />}
    </div>
    {showMenu
      && <TaskMenu setCopy={setCopy} setUpdate={setUpdate} deleteTask={deleteTask} name={name}
    />}
  </div>;
};

export default TaskMenuButton;
