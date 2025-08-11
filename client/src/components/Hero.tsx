const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="pt-20 bg-gradient-to-br from-turquoise to-palerose min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold text-darkgray leading-tight">
              Atención Veterinaria a Domicilio con 
              <span className="text-mint"> Amor</span> y 
              <span className="text-lavender"> Profesionalismo</span>
            </h1>
            <p className="text-xl text-darkgray font-lato leading-relaxed">
              Cuidamos a tu mascota en la comodidad de tu hogar. Servicios veterinarios especializados con el cariño que tu compañero peludo merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('agendar')}
                className="bg-mint text-darkgray px-8 py-4 rounded-xl font-poppins font-semibold hover:shadow-lg transition-all text-center"
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Agendar Hora
              </button>
              <button 
                onClick={() => scrollToSection('servicios')}
                className="bg-white text-darkgray px-8 py-4 rounded-xl font-poppins font-semibold hover:shadow-lg transition-all"
              >
                Ver Servicios
              </button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Yorkshire Terrier feliz en casa" 
              className="rounded-3xl shadow-2xl w-full h-auto" 
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-3">
                <i className="fas fa-shield-alt text-mint text-2xl"></i>
                <div>
                  <p className="font-poppins font-semibold text-darkgray">100% Seguro</p>
                  <p className="text-sm text-gray-600">Veterinarios certificados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
