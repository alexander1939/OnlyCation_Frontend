import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth';
import Home from '../pages/home/Home';

const HomeGuard: React.FC = () => {
  const { user } = useAuthContext();
  const storedStatus = localStorage.getItem('user_status') || '';
  const storedRole = localStorage.getItem('user_role') || '';
  const currentStatus = (((user as any)?.status as string) || storedStatus).toLowerCase();
  const role = (user as any)?.role || storedRole;

  if (role === 'teacher' && currentStatus !== 'active') {
    return <Navigate to="/teacher/activate-account" replace />;
  }

  return <Home />;
};

export default HomeGuard;
