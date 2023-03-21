import './FloatingForm.css';
import CloseIcon from '@mui/icons-material/Close';

const FloatingForm = ({ children, setVisibility }) => (
  <div
    className='add-instance-background'
    onClick={({ target }) => {
      if (target.className === 'add-instance-background')
        setVisibility(false);
    }}
  >
    <div className='add-instance'>
      {children}
      <button onClick={() => setVisibility(false)} className="form-corner-button">
        <CloseIcon />
        {/* <span>×</span> */}
      </button>
    </div>
  </div>
);

export default FloatingForm;
