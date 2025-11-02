import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConfirmationCard: React.FC = () => {
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
        fontFamily: 'Roboto, sans-serif',
      }}
      onClick={() => navigate('/confirmacion')}
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
          backgroundColor: '#E6FFFA', // verde agua suave
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <CheckCircle color="#16a34a" size={24} />
      </div>

      <h3
        style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#1F2937',
        }}
      >
        Confirmación de Asesoría
      </h3>

      <p
        style={{
          color: '#4B5563',
          marginBottom: '1rem',
          fontSize: '0.95rem',
        }}
      >
        Verifica los datos y confirma tu próxima sesión personalizada.
      </p>

      <span
        onClick={(e) => {
          e.stopPropagation();
          navigate('/confirmacion');
        }}
        style={{
          color: '#047857',
          fontWeight: 600,
          fontSize: '0.95rem',
        }}
      >
        Confirmar asesoría →
      </span>
    </div>
  );
};

export default ConfirmationCard;
