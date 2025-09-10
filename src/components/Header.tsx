import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 w-full" 
        style={{
          fontFamily: 'Roboto, sans-serif',
          backgroundColor: 'transparent',
          padding: '16px 0'
        }}
      >
        <div 
          className="w-full" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '50px',
              padding: '8px 24px',
              gap: '32px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
          
          {/* Logo Simple */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="OnlyCation Logo" 
              className="w-[60px] h-[60px]"
              style={{
                objectFit: 'contain'
              }}
            />
            <span className="font-semibold text-lg" style={{color: '#294954', fontFamily: 'Inter, sans-serif'}}>OnlyCation</span>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-12">
            {[
              { name: 'Inicio' },
              { name: '¿Ser docente?' },
              { name: 'Sobre nosotros' }
            ].map((item, index) => (
              <a 
                key={index} 
                href="#"
                className="font-semibold text-lg"
                style={{
                  color: '#294954',
                  fontFamily: 'Inter, sans-serif',
                  padding: '10px',
                  textDecoration: 'none'
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Perfil Dropdown */}
          <div className="relative ml-8">
            <button 
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-100 overflow-hidden"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img 
                src="/usuario.png" 
                alt="Usuario" 
               className="w-[30px] h-[30px]"
               style={{
                objectFit: 'contain',
              }}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: 'rgba(104, 178, 201, 0.2)',
                  zIndex: 1000
                }}
              >
                <div className="py-2">
                  <button
                    className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50"
                    style={{
                      color: '#294954',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50"
                    style={{
                      color: '#294954',
                      fontFamily: 'Roboto, sans-serif'
                    }}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-[#294954]/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="fixed top-24 left-4 right-4 bg-[#FAF9F5]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#68B2C9]/20 p-8">
            <nav className="flex flex-col space-y-6 font-['Roboto']">
              {[
                { name: 'Inicio' },
                { name: 'Tutores' },
                { name: 'Sobre nosotros' },
                { name: '¿Ser docente?' }
              ].map((item, index) => (
                <button
                  key={index}
                  className="text-[#294954] font-medium text-lg py-4 px-6 rounded-2xl hover:bg-[#68B2C9]/10 hover:text-[#68B2C9] transition-all duration-300 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="pt-6 border-t border-[#68B2C9]/20">
                <button className="w-full bg-[#68B2C9] text-[#FAF9F5] rounded-2xl px-6 py-4 text-base font-medium shadow-lg hover:bg-[#294954] hover:shadow-xl transition-all duration-300 font-['Roboto']">
                  Perfil
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
