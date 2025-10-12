// src/pages/student/StudentHome.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginApi } from '../../hooks/auth/useLoginApi';
import Header from '../../components/Header';
import PublishConsult from '../../components/PublishConsult';
import AgendaCard from '../../components/AgendaCard'; 
import PriceCard from '../../components/PriceCard';
import SubjectList from '../../components/SubjectList';
import FeaturedAdvisors from '../../components/FeaturedAdvisors';
import KnowledgeCenter from '../../components/KnowledgeCenter';
import { Footer } from '../../components';

const StudentHome: React.FC = () => {
  const { logout } = useLoginApi();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: '7.5rem 2rem 2rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
        }}
      >
        <div>
          {/* 🔹 Publicar consulta + Agenda uno al lado del otro */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <PublishConsult />
            <AgendaCard /> {/* 👈 nuevo card al lado */}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <PriceCard />
            <SubjectList /> {/* 👈 nuevo card al lado */}
          </div>
          {/* 🔹 Resto de los componentes */}

          <KnowledgeCenter />
        </div>

        {/* 🔹 Panel lateral */}
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
      <Footer />
    </>
  );
};

export default StudentHome;
