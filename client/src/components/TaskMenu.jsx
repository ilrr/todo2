import { useEffect, useState } from 'react';
import FloatingForm from './FloatingForm';
import './TaskMenu.css';

const TaskMenu = props => {
  const {
    setCopy, setUpdate, setMove, deleteTask, name, setShowMenu,
  } = props;

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  let clickedSomewhere = false;

  const clickListener = () => {
    if (clickedSomewhere) {
      setShowMenu(false);
      document.removeEventListener('click', clickListener);
    } else
      clickedSomewhere = true;
  };

  useEffect(() => {
    document.addEventListener('click', clickListener);
  }, []);

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
      <div className='task-menu-content-item' onClick={() => setMove(true)}> siirrä </div>
      <div className='task-menu-content-item' onClick={() => setShowDeleteConfirmation(true)}> poista </div>
    </div>
  </>
  );
};

export default TaskMenu;
