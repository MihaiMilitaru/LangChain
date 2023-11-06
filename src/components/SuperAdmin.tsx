import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from '../store/slices/user';

export default function SuperAdmin({ children }) {
  const user = useSelector(selectUser);

  return user.role === 1 ? children : <Navigate to="/chat" />;
}
