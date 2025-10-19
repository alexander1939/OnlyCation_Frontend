import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TeacherHero from './TeacherHero';
import TeacherContent from './TeacherContent';

const BeTeacher: React.FC = () => {
  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#FAF9F5', margin: 0, padding: 0 }}>
      <Header />
      
      {/* Usar el mismo espaciado superior que AboutUs para no tapar el título con el Header fijo */}
      <main style={{ paddingTop: '120px', paddingBottom: '64px' }}>
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
