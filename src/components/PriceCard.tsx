import React from 'react';
import { GraduationCap } from 'lucide-react';

const PriceCard: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        Costo estimado
      </p>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: '#1e3a3a' }}>
        $200
      </h1>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '9999px',
          padding: '0.25rem 0.75rem',
          marginTop: '0.5rem',
        }}
      >
        <GraduationCap size={18} color="#1e3a3a" />
        <span style={{ color: '#1e3a3a', fontWeight: 500 }}>Matemáticas</span>
      </div>

      <p
        style={{
          fontSize: '0.8rem',
          color: '#9ca3af',
          marginTop: '1rem',
        }}
      >
        Esto es un estimado, por favor continúa para obtener el precio final.
      </p>
    </div>
  );
};

export default PriceCard;
