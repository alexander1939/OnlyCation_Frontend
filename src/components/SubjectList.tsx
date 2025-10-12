import React from 'react';

const subjects = ['Física', 'Química', 'Programación', 'Historia'];

const SubjectList: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '1rem' }}>
      {subjects.map((subject) => (
        <div key={subject} style={{
          padding: '0.75rem 1rem',
          borderBottom: '1px solid #eee',
          cursor: 'pointer'
        }}>
          {subject}
        </div>
      ))}
    </div>
  );
};

export default SubjectList;
