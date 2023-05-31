import { useLocation, useNavigate } from 'react-router-dom';

const Error = () => {
  const location = useLocation();
  const navigate = useNavigate();
  setTimeout(() => {
    navigate('/');
  }, 5000);
  return (
    <div>
      <p>Tapahtui virhe</p>
      {location.state && location.state.error && <p>{location.state.error}</p>}
      <p>Palataan etusivulle...</p>
    </div>
  );
};

export default Error;
