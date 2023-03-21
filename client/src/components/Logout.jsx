import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userReducer';

const Logout = ({ msg }) => {
  const dispatch = useDispatch();
  dispatch(logout());
  window.localStorage.clear();

  return (
    <div>
      {msg}
    </div>
  );
};

export default Logout;
