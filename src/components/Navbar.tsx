import { useDispatch, useSelector } from 'react-redux';
import './navbar.css';
import { Link } from 'react-router-dom';
import { logout, selectUser } from '../store/slices/user';

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  return (
    <nav className="menuBar">
      <div className="menu-left-side">
        <img
          src="/src/images/logo.png"
          style={{ width: '20px', height: '20px' }}
        ></img>
        <span className="logo">BEECODED</span>
      </div>
      <input id="menu-toggle" type="checkbox" />
      <label className="menu-button-container" htmlFor="menu-toggle">
        <div className="menu-button"></div>
      </label>
      <div className="menu-right-side">
        <li>
          <Link to="/chat">Chat</Link>
        </li>
        {user.role === 1 || user.role === 2 ? (
          <>
            <li>
              <Link to="/chapters">Chapters</Link>
            </li>
            <li>
              <Link to="/admin">Upload Files</Link>
            </li>
            <li>
              <Link to="/update-roles">Users</Link>
            </li>
            <li>
              <Link to="/create-roles">Roles</Link>
            </li>
          </>
        ) : (
          <></>
        )}

        <li onClick={() => dispatch(logout())}>
          <a style={{ cursor: 'pointer' }}>Logout</a>
        </li>
      </div>
    </nav>
  );
}
