import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './TopBar.css';

const TopBar = () => {
  const userInfo = useSelector(({ user }) => user);

  return (
    <div className="bar">
      <div id="logo">
        <Link to='/'>
          <img src="/logo512.png" id="logo"/>
        </Link>
      </div>
      {userInfo.name
        ? <>
          <div>{userInfo.name}</div>
          <div><Link to='/logout'>Kirjaudu ulos</Link></div>
        </>
        : <>
          <div><Link to='/login'>Kirjaudu</Link></div>
          <div><Link to='/register'>Rekisteröidy</Link></div>
        </>
      }
    </div>
  );
};

export default TopBar;
