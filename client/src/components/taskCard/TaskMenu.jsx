import { useEffect } from 'react';
import './TaskMenu.css';

const TaskMenu = props => {
  const {
    setCopy, setUpdate, setMove, setShowMenu, setShowDeleteConfirmation, setAddChildren,
  } = props;

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

    <div className='task-menu-content'>
      <div className='task-menu-content-item' onClick={() => setUpdate(true)}> muokkaa </div>
      <div className='task-menu-content-item' onClick={() => setCopy(true)}> kopioi </div>
      <div className='task-menu-content-item' onClick={() => setAddChildren(true)}> johdannaistehtävät </div>
      <div className='task-menu-content-item' onClick={() => setMove(true)}> siirrä </div>
      <div className='task-menu-content-item' onClick={() => setShowDeleteConfirmation(true)}> poista </div>
    </div>
  </>
  );
};

export default TaskMenu;
