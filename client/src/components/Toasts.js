import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastTimeoutsSet, removeToast } from '../reducers/toastReducer';

const Toast = props => {
  const dispatch = useDispatch();
  return <div className={`toast ${props.type}`} onClick={() => dispatch(removeToast(props.id))}>
    {props.children}
  </div>;
};

const Toasts = () => {
  const { toasts, removeTimeoutNotSet } = useSelector(state => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (removeTimeoutNotSet.length) {
      removeTimeoutNotSet.forEach(id => setTimeout(() => dispatch(removeToast(id)), 5000));
      dispatch(toastTimeoutsSet(removeTimeoutNotSet));
    }
  }, [toasts]);

  return (
      <div className='toast-container'>
      {toasts.map(toast => <Toast
        key={toast.id}
        id={toast.id}
        type={toast.type}>{
          toast.content}
      </Toast>)}
    </div>
  );
};

export default Toasts;
