import React from 'react';
import { ChevronRight } from 'lucide-react';

const levels = ['Media Superior', 'Superior', 'Posgrado'];

const SubjectList: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '1rem',
        padding: '1rem',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}
    >
      {levels.map((level) => (
        <div
          key={level}
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            cursor: 'pointer',
            fontWeight: 500,
            color: '#1e3a3a',
          }}
        >
          <span>{level}</span>
          <ChevronRight size={18} color="#1e3a3a" />
        </div>
      ))}
    </div>
  );
};

export default SubjectList;
