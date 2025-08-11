import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginType, setLoginType] = useState<'tutor' | 'profesional'>('tutor');
  const { user, signOut } = useAuth();

  const showLoginModal = (type: 'tutor' | 'profesional') => {
    setLoginType(type);
    setLoginModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50" id="navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <i className="fas fa-heart text-palerose text-2xl"></i>
              <h1 className="text-2xl font-poppins font-bold text-darkgray">VetCare Chile</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('quien-soy')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Quién Soy
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Servicios
              </button>
              <button 
                onClick={() => scrollToSection('agendar')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Agendar Cita
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollToSection('recursos')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Recursos
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="text-darkgray hover:text-mint font-medium transition-colors"
              >
                Contacto
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-darkgray">Hola, {user.email}</span>
                  <button 
                    onClick={signOut}
                    className="bg-destructive text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => showLoginModal('tutor')}
                    className="bg-lavender text-darkgray px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                  >
                    Portal Tutor
                  </button>
                  <button 
                    onClick={() => showLoginModal('profesional')}
                    className="bg-mint text-darkgray px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all"
                  >
                    Portal Veterinario
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-darkgray"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="py-4 space-y-4">
                <button 
                  onClick={() => scrollToSection('inicio')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Inicio
                </button>
                <button 
                  onClick={() => scrollToSection('quien-soy')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Quién Soy
                </button>
                <button 
                  onClick={() => scrollToSection('servicios')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Servicios
                </button>
                <button 
                  onClick={() => scrollToSection('agendar')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Agendar Cita
                </button>
                <button 
                  onClick={() => scrollToSection('faq')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => scrollToSection('recursos')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Recursos
                </button>
                <button 
                  onClick={() => scrollToSection('contacto')}
                  className="block text-darkgray hover:text-mint font-medium w-full text-left"
                >
                  Contacto
                </button>
                
                {user ? (
                  <div className="pt-4 space-y-3">
                    <p className="text-darkgray">Hola, {user.email}</p>
                    <button 
                      onClick={signOut}
                      className="w-full bg-destructive text-white px-4 py-2 rounded-lg"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 space-y-3">
                    <button 
                      onClick={() => showLoginModal('tutor')}
                      className="w-full bg-lavender text-darkgray px-4 py-2 rounded-lg"
                    >
                      Portal Tutor
                    </button>
                    <button 
                      onClick={() => showLoginModal('profesional')}
                      className="w-full bg-mint text-darkgray px-4 py-2 rounded-lg"
                    >
                      Portal Veterinario
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        type={loginType}
      />
    </>
  );
};

export default Navigation;
