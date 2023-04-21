import { useEffect, useState } from 'react';
import './TaskMenu.css';

const TaskMenu = props => {
  const {
    setCopy, setUpdate, setMove, setShowMenu, setShowDeleteConfirmation, setAddChildren,
  } = props;

  const [childTaskMenuExpanded, setChildTaskMenuExpanded] = useState(false);
  let clickedSomewhere = false;

  const clickListener = event => {
    if (clickedSomewhere && !event.target.classList.contains('expandable')) {
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
      {/* <div
        className='task-menu-content-item'
        onClick={() => setAddChildren(true)}>
        johdannaistehtävät </div> */}
      <div className='task-menu-content-item expandable' onClick={() => setChildTaskMenuExpanded(!childTaskMenuExpanded)}>
        alatehtävät
        {childTaskMenuExpanded && <>
          <div className='task-menu-submenu'>
            <div className='submenu-item' onClick={() => setAddChildren(true)}> lisää alatehtäviä </div>
            <div className='submenu-item' onClick={() => console.log('nappi ;-)')}> muuta alatehtäväksi </div>
          </div>
          </>}
      </div>
      <div className='task-menu-content-item' onClick={() => setMove(true)}> siirrä </div>
      <div className='task-menu-content-item' onClick={() => setShowDeleteConfirmation(true)}> poista </div>
    </div>
  </>
  );
};

export default TaskMenu;
