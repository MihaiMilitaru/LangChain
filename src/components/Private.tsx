import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../store/slices/user';

export default function Private({ children }) {
  const user = useSelector(selectUser);

  if (user.role === -1) {
    return <Navigate to="/" />;
  } else if (user.role === 1 || user.role === 2) {
    return children;
  } else {
    return <Navigate to="/chat" />;
  }
}
