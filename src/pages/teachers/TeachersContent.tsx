import React from 'react';

const TeachersContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
      {/* Aquí irían más cards de docentes */}
      <div className="text-center p-8 rounded-[20px] border-2 border-mint-green" style={{backgroundColor: '#8ED4BE'}}>
        <h3 className="text-[24px] font-bold mb-4" style={{color: '#294954'}}>
          Próximamente
        </h3>
        <p className="text-[16px]" style={{color: '#294954'}}>
          Más docentes estarán disponibles pronto
        </p>
      </div>
    </div>
  );
};

export default TeachersContent;
