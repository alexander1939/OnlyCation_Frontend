import React from 'react';
import Ribbon from '../../components/ui/Ribbon';

const TeacherHero: React.FC = () => {
  return (
    <section className="py-12 px-6" style={{ backgroundColor: '#FAF9F5' }}>
      <div className="max-w-5xl mx-auto text-center">
        <div>
          <Ribbon text="Conviértete en docente" backgroundColor="#68B2C9" textColor="#ffffff" fontSize="13px" padding="6px 20px" />
          <h1
            className="font-bold mb-4"
            style={{ color: '#294954', fontSize: '3rem' }}
          >
            Comparte tu experiencia y gana enseñando
          </h1>
          <p
            className="mx-auto mb-8"
            style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '760px', lineHeight: 1.6 }}
          >
            Únete a OnlyCation, crea tu perfil con video de presentación, establece tu agenda y comienza a recibir estudiantes.
          </p>
          <div className="flex justify-center mb-2">
            <div className="w-24 h-1 rounded-full" style={{ backgroundColor: '#68B2C9' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherHero;
