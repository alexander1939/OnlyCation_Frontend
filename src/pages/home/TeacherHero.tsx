import React from 'react';
import Ribbon from '../../components/ui/Ribbon';

const TeacherHero: React.FC = () => {
  return (
    <section className="teacher-hero">
      <div className="max-w-5xl mx-auto text-center">
        <div>
          <Ribbon text="Conviértete en docente" backgroundColor="#68B2C9" textColor="#ffffff" fontSize="13px" padding="6px 20px" />
          <h1 className="teacher-hero-title font-bold mb-4">
            Comparte tu experiencia y gana enseñando
          </h1>
          <p className="teacher-hero-description mx-auto mb-8">
            Únete a OnlyCation, crea tu perfil con video de presentación, establece tu agenda y comienza a recibir estudiantes.
          </p>
          <div className="flex justify-center mb-2">
            <div className="teacher-hero-divider w-24 h-1 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherHero;
