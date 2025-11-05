import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import TeachersHero from './TeachersHero';
import TeachersContent from './TeachersContent';
import { TeachersProvider } from '../../context/teachers/TeachersContext';

const AllTeachers: React.FC = () => {
  return (
    <div className="min-h-screen bg-soft-white">
      <Header />
      
      <main className="py-[80px] px-[50px]">
        <div className="max-w-[1200px] mx-auto">
          <TeachersHero />
          <TeachersProvider>
            <TeachersContent />
          </TeachersProvider>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllTeachers;