import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './ui/Header';
import Footer from './ui/Footer';
import OfflineNotification from './ui/OfflineNotification';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full" style={{backgroundColor: '#FAF9F5', margin: 0, padding: 0}}>
      <Header />
      <OfflineNotification />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
