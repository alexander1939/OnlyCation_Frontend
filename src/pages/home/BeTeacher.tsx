import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TeacherHero from './TeacherHero';
import TeacherContent from './TeacherContent';
import '../../styles/be-teacher.css';

const BeTeacher: React.FC = () => {
  return (
    <div className="be-teacher-page min-h-screen w-full">
      <Header />
      
      {/* Usar el mismo espaciado superior que AboutUs para no tapar el título con el Header fijo */}
      <main className="be-teacher-main">
        <div className="max-w-5xl mx-auto px-6">
          <TeacherHero />
          <TeacherContent />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BeTeacher;
