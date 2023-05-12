import './ListOptionBar.css';
import MenuIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import CloseIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import { useEffect, useState } from 'react';

const ListOptionsBar = ({
  labels, actions, selected,
}) => {
  const [hide, setHide] = useState(true);

  let prev = window.scrollY;

  // const setHideAndPrev = state => { setHide(state); prev = window.scrollY; };

  const hideBar = () => {
    if (window.scrollY - prev > 10)
      setHide(true);
    else if (window.scrollY - prev < -10)
      setHide(false);
    prev = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', hideBar);
    return () => window.removeEventListener('scroll', hideBar);
  });

  return hide
    ? <div className='list-options-bar-show-button activate' onClick={() => setHide(false)}>
      <MenuIcon/>
    </div>
    : <div className="list-options-bar">
      {labels.map((label, i) => <button
        onClick={actions[i]}
        className={selected[i] ? 'selected' : ''}
        key={i}>
        {label}
      </button>)
      }
      <div className='list-options-bar-show-button hide' onClick={() => setHide(true)}>
        <CloseIcon />
      </div>
    </div>;
};

export default ListOptionsBar;
