import './ListOptionBar.css';
import MenuIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import CloseIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

const ListOptionsBar = ({
  labels, actions, selected,
}) => {
  const [hide, setHide] = useState(true);

  let prevY = window.scrollY;

  // const setHideAndPrev = state => { setHide(state); prev = window.scrollY; };

  const hideBar = () => {
    if (window.scrollY - prevY > 10)
      setHide(true);
    else if (window.scrollY - prevY < -10)
      setHide(false);
    prevY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', hideBar);
    return () => window.removeEventListener('scroll', hideBar);
  });

  const barRef = useRef(null);
  const btnRef = useRef(null);
  const ANIMATION_DURATION = 400;

  return <>
    <CSSTransition
      nodeRef={barRef}
      in={!hide}
      unmountOnExit
      timeout={ANIMATION_DURATION}
      classNames="list-options-bar-animate"
    >
      <div ref={barRef} className='list-options-bar'>
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
      </div>
    </CSSTransition>
    <CSSTransition
      nodeRef={btnRef}
      in={hide}
      unmountOnExit
      timeout={ANIMATION_DURATION}
      classNames="show-button-animate"
    >
      <div ref={btnRef} className='list-options-bar-show-button activate' onClick={() => setHide(false)}>
        <MenuIcon />
      </div>

    </CSSTransition>
  </>;

  // return hide
  //   ? <div className='list-options-bar-show-button activate' onClick={() => setHide(false)}>
  //     <MenuIcon/>
  //   </div>
  //   : <div className='list-options-bar'>
  //     {labels.map((label, i) => <button
  //       onClick={actions[i]}
  //       className={selected[i] ? 'selected' : ''}
  //       key={i}>
  //       {label}
  //     </button>)
  //     }
  //     <div className='list-options-bar-show-button hide' onClick={() => setHide(true)}>
  //       <CloseIcon />
  //     </div>
  //   </div>;
};

export default ListOptionsBar;
