import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TeacherHero from './TeacherHero';
import TeacherContent from './TeacherContent';

const BeTeacher: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <TeacherHero />
          <TeacherContent />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BeTeacher;
