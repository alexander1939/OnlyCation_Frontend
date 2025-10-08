import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from '../../context/auth/LoginContext';
import Header from '../../components/Header'; // 👈 importar el Header

const TeacherHome: React.FC = () => {
  const { logout } = useLoginContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Header siempre arriba */}
      <Header />

      {/* Contenido de la página */}
      <div style={{ padding: '6rem 2rem 2rem', textAlign: 'center' }}>
        <h1>Bienvenido Teacher 👨‍🏫</h1>
        <p>Has iniciado sesión como docente.</p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default TeacherHome;
