import React from 'react';
import { useNavigate } from 'react-router-dom';


const AgendaCard: React.FC = () => {
const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: '#97E0C1', // verde menta
        borderRadius: '1rem',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // alinea a la izquierda
        height: '200px',
      }}
    >
      <img
        src="./agenda-zorro1.png"
        alt="Calendario"
        style={{
          height: '200%',
          width: 'auto',
          objectFit: 'contain',
          marginRight: '-1rem', // separa de cualquier otro contenido
        }}
      />
      {/* Si luego quieres texto o iconos, los puedes poner aquí */}
      <button
        onClick={() => navigate('/publicar')}
        style={{
          marginTop: 'auto',
          backgroundColor: '#FDDC91',
          color: '#1F3C48',
          border: 'none',
          borderRadius: '2rem',
          padding: '0.8rem 1.5rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        Agendar Citas →
      </button>
    </div>
  );
};

export default AgendaCard;
