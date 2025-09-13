import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import HeroSection from './HeroSection';
import StepsSection from './StepsSection';
import TeachersSection from './TeachersSection';
import SubjectsSection from './SubjectsSection';
import CallToActionSections from './CallToActionSections';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen w-full snap-y snap-mandatory overflow-y-scroll" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      <HeroSection />
      <StepsSection />
      <TeachersSection />
      <SubjectsSection />
      <CallToActionSections />
      <Footer />
    </div>
  );
};

export default Home;
