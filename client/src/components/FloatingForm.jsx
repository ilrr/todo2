import { useEffect } from 'react';
import './FloatingForm.css';
import CloseIcon from '@mui/icons-material/Close';

const FloatingForm = ({ children, setVisibility }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  });
  return (
    <div
      className='add-instance-background'
      onClick={({ target }) => {
        if (target.className === 'add-instance-background')
          setVisibility(false);
      }}
  >
      <div className='add-instance'>
        <div className='add-instance-inner'>
          {children}
        </div>
        <button onClick={() => setVisibility(false)} className="form-corner-button">
          <CloseIcon style={{ fontSize: '1.25em' }} />
          {/* <span>×</span> */}
        </button>
      </div>
    </div>
  );
};

export default FloatingForm;
