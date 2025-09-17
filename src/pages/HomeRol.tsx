import React from 'react';
import { useAuthContext } from '../context/Auth/AuthContext';

const HomeRol = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <p>Cargando...</p>;
  if (!user) return <p>No estás logueado</p>;

  return (
    <div>
      {user.role === 'teacher' && <p>Hola Teacher 👋</p>}
      {user.role === 'student' && <p>Hola Student 👋</p>}
    </div>
  );
};

export default HomeRol;
