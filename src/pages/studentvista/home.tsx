import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContext';
import Header from '../../components/Header'; // importa tu Header

const StudentHome: React.FC = () => {
  const { logout } = useAuthContext();
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
        <h1>Bienvenido Student 🎓</h1>
        <p>Has iniciado sesión como estudiante.</p>

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

export default StudentHome;
