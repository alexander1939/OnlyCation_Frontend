import React from 'react';
import { useAuthContext } from '../../context/auth';
import { useLoginApi } from '../../hooks/auth/useLoginApi';
import PublicHeader from './PublicHeader';
import TeacherHeader from './TeacherHeader';
import StudentHeader from './StudentHeader';

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
    return <PublicHeader />;
  }

  // Docente: Header de teacher
  if (isTeacher) {
    return <TeacherHeader user={user} onLogout={handleLogout} />;
  }

  // Alumno: Header de student
  if (isStudent) {
    return <StudentHeader user={user} onLogout={handleLogout} />;
  }

  // Fallback: Header público
  return <PublicHeader />;
};

export default Header;
