import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TeachersHero from './TeachersHero';
import TeachersContent from './TeachersContent';

const AllTeachers: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      
      <main className="py-[80px] px-[50px]">
        <div className="max-w-[1200px] mx-auto">
          <TeachersHero />
          <TeachersContent />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllTeachers;
