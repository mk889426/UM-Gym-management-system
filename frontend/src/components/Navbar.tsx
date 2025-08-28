// src/components/Navbar.tsx
import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks';
import { logout } from '../features/auth/authSlice';

const Navbar: FC = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    nav('/login');
  };

  return (
    <nav className="bg-secondary text-white p-4 flex justify-between">
      <div className="text-xl font-bold">Gym Portal</div>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/members">Members</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;