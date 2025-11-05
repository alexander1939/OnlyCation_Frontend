import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5'}}>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
