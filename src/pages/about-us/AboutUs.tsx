import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AboutUsHero from './AboutUsHero';
import MissionSection from './MissionSection';
import ValuesSection from './ValuesSection';
import VisionSection from './VisionSection';
import DevelopersSection from './DevelopersSection';

const AboutUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Datos de los desarrolladores
  const developers = [
    {
      name: "Gael Espinosa Fernandez",
      role: "Frontend Developer",
      email: "fernandezgael707@gmail.com",
      image: "/usuario.png",
      skills: ["React", "TypeScript", "TailwindCSS", "Vite", "UI/UX"]
    },
    {
      name: "Jesus Guzman Jimenez",
      role: "Backend Developer",
      email: "jesusguzmanjimenez53@gmail.com",
      image: "/usuario.png",
      skills: ["React", "Express", "Docker", "PostgreSQL", "Node.js"]
    },
    {
      name: "Gustavo Alexander Medina Cifuentes",
      role: "Full Stack Developer",
      email: "Alexcifuentes72818@gmail.com",
      image: "/usuario.png",
      skills: ["React", "Node.js", "AWS", "Docker", "DevOps"]
    },
    {
      name: "Roberto Carlos Nuñez Cruz",
      role: "Frontend Developer",
      email: "robertocarlosnunezcruz9@gmail.com",
      image: "/usuario.png",
      skills: ["React", "TypeScript", "TailwindCSS", "Vite", "UI/UX"]
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      
      <main style={{paddingTop: '120px', paddingBottom: '64px'}}>
        <AboutUsHero isVisible={isVisible} />
        <MissionSection />
        <ValuesSection />
        <VisionSection />
        <DevelopersSection developers={developers} isVisible={isVisible} />
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
