import React from 'react';

const advisors = [
  { name: 'Daniel', rating: 4.9, subject: 'Física' },
  { name: 'Elisa', rating: 4.8, subject: 'Programación' },
  { name: 'James', rating: 4.8, subject: 'Química' },
];

const FeaturedAdvisors: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1.5rem' }}>
      <h3>Asesores Destacados</h3>
      {advisors.map((a) => (
        <div key={a.name} style={{
          backgroundColor: '#FFF4CC',
          borderRadius: '1rem',
          padding: '1rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <h4>{a.name}</h4>
          <p>⭐ {a.rating} | {a.subject}</p>
          <button style={{
            backgroundColor: '#1E90FF',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}>
            Contactar
          </button>
        </div>
      ))}
    </div>
  );
};

export default FeaturedAdvisors;
