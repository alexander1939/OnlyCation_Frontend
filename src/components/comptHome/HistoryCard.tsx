import React from 'react';
import { History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        fontFamily: 'Roboto, sans-serif', // 👈 aquí aplicas Roboto
      }}
      onClick={() => navigate('/historial')}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.1)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)')
      }
    >
      {/* Icono circular */}
      <div
        style={{
          backgroundColor: '#E6F4EA',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <History color="#22C55E" size={24} />
      </div>

      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#1F2937',
        }}
      >
        Historia de Clases
      </h3>
      <p style={{ color: '#4B5563', marginBottom: '1rem', fontSize: '0.95rem' }}>
        Revisa tus clases pasadas y el material de estudio.
      </p>

      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate('/historial');
        }}
        style={{
          color: '#16A34A',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}
      >
        Ver historial →
      </span>
    </div>
  );
};

export default HistoryCard;
