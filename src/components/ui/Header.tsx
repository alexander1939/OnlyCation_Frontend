import React from 'react';
import { useAuthContext } from '../../context/auth';
import { useLoginApi } from '../../hooks/auth/useLoginApi';
import PublicHeader from './PublicHeader';
import TeacherHeader from './TeacherHeader';
import StudentHeader from './StudentHeader';
import NavigationOverlay from '../shared/NavigationOverlay';

const Header: React.FC = () => {
  const { user, setUser } = useAuthContext();
  const { logout } = useLoginApi();
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  // Sin sesión: Header público
  if (!user) {
    return (
      <>
        <PublicHeader />
        <NavigationOverlay />
      </>
    );
  }

  // Docente: Header de teacher
  if (isTeacher) {
    return (
      <>
        <TeacherHeader user={user} onLogout={handleLogout} />
        <NavigationOverlay />
      </>
    );
  }

  // Alumno: Header de student
  if (isStudent) {
    return (
      <>
        <StudentHeader user={user} onLogout={handleLogout} />
        <NavigationOverlay />
      </>
    );
  }

  // Fallback: Header público
  return (
    <>
      <PublicHeader />
      <NavigationOverlay />
    </>
  );
};

export default Header;
