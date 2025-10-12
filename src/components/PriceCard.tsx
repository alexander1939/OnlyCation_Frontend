import React from 'react';

const PriceCard: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>Costo estimado</h3>
      <h1>$50</h1>
      <p>Matemáticas</p>
      <small>Esto es un estimado, continúa para obtener el precio final.</small>
    </div>
  );
};

export default PriceCard;
