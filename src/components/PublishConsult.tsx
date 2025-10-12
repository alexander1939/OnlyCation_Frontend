import React from 'react';

const PublishConsult: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#FFD93D',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h3>Publicar una consulta</h3>
      <button
        style={{
          marginTop: '1rem',
          backgroundColor: '#1E90FF',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Publicar una consulta →
      </button>
    </div>
  );
};

export default PublishConsult;
