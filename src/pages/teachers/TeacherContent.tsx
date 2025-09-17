import React from 'react';

const TeacherContent: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-mint-green p-8 md:p-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-petroleum-blue mb-6">
            Comparte tu experiencia
          </h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              Como docente en OnlyCation, tendrás la oportunidad de:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-mint-green mr-3 text-xl">•</span>
                <span><strong>Enseñar</strong> a estudiantes motivados</span>
              </li>
              <li className="flex items-start">
                <span className="text-mint-green mr-3 text-xl">•</span>
                <span><strong>Crear</strong> tu propio horario</span>
              </li>
              <li className="flex items-start">
                <span className="text-mint-green mr-3 text-xl">•</span>
                <span><strong>Generar</strong> ingresos adicionales</span>
              </li>
              <li className="flex items-start">
                <span className="text-mint-green mr-3 text-xl">•</span>
                <span><strong>Impactar</strong> positivamente en la educación</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-8">
            <button className="bg-mint-green text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-petroleum-blue transition-colors duration-300 shadow-lg">
              Aplicar ahora
            </button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <img 
            src="/Penzando_zorro.png" 
            alt="Zorro pensando" 
            className="w-80 h-80 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherContent;
