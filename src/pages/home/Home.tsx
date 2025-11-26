import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './HeroSection';
import AdvantagesSection from './AdvantagesSection';
import StepsSection from './StepsSection';
import TeachersSection from './TeachersSection';
import SubjectsSection from './SubjectsSection';
import CallToActionSections from './CallToActionSections';
import { TeachersProvider } from '../../context/teachers/TeachersContext';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      <HeroSection />
      <AdvantagesSection />
      <StepsSection />
      <TeachersProvider>
        <TeachersSection />
      </TeachersProvider>
      <SubjectsSection />
      <CallToActionSections />
      <Footer />
    </div>
  );
};

export default Home;
