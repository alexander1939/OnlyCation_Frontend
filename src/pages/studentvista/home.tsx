import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth/AuthContext';
import Header from '../../components/Header';
import PublishConsult from '../../components/PublishConsult';
import PriceCard from '../../components/PriceCard';
import SubjectList from '../../components/SubjectList';
import FeaturedAdvisors from '../../components/FeaturedAdvisors';
import KnowledgeCenter from '../../components/KnowledgeCenter';

const StudentHome: React.FC = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Header />

      {/* 🔹 Separación ligeramente mayor respecto al Header */}
      <div
        style={{
          padding: '7.5rem 2rem 2rem', // <-- antes era 6rem, ahora hay más separación
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          <PublishConsult />
          <PriceCard />
          <SubjectList />
          <KnowledgeCenter />
        </div>

        <FeaturedAdvisors />
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default StudentHome;
