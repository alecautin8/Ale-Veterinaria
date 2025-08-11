import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Booking from '@/components/Booking';
import FAQ from '@/components/FAQ';
import Resources from '@/components/Resources';
import Contact from '@/components/Contact';

const HomePage = () => {
  const coverageAreas = [
    { name: "Las Condes", color: "text-mint" },
    { name: "Vitacura", color: "text-lavender" },
    { name: "Providencia", color: "text-turquoise" },
    { name: "Ñuñoa", color: "text-palerose" },
    { name: "Santiago Centro", color: "text-mint" },
    { name: "La Reina", color: "text-lavender" },
    { name: "Macul", color: "text-turquoise" },
    { name: "Peñalolén", color: "text-palerose" }
  ];

  return (
    <div className="bg-warmbeige font-lato">
      <Navigation />
      <Hero />
      <Services />
      
      {/* Coverage Areas Section */}
      <section className="py-20 bg-gradient-to-r from-warmbeige to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-darkgray mb-4">Zonas de Cobertura</h2>
            <p className="text-xl text-gray-600">Atendemos en las siguientes comunas de Santiago</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageAreas.map((area, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <i className={`fas fa-map-marker-alt ${area.color} text-3xl mb-4`}></i>
                <h3 className="font-poppins font-semibold text-darkgray text-lg">{area.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <About />
      <Booking />
      <FAQ />
      <Resources />
      <Contact />

      {/* Footer */}
      <footer className="bg-darkgray text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <i className="fas fa-heart text-palerose text-2xl"></i>
                <h3 className="text-xl font-poppins font-bold">VetCare Chile</h3>
              </div>
              <p className="text-gray-300 font-lato leading-relaxed">
                Atención veterinaria profesional a domicilio. Cuidamos a tu mascota con amor y dedicación en Santiago, Chile.
              </p>
            </div>
            
            <div>
              <h4 className="font-poppins font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-300 font-lato">
                <li><button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-mint transition-colors">Servicios</button></li>
                <li><button onClick={() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-lavender transition-colors">Agendar Cita</button></li>
                <li><button onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-turquoise transition-colors">FAQ</button></li>
                <li><button onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-palerose transition-colors">Contacto</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-poppins font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-300 font-lato">
                <li><i className="fas fa-phone mr-2"></i>+56 9 1234 5678</li>
                <li><i className="fas fa-envelope mr-2"></i>info@vetcarechile.com</li>
                <li><i className="fas fa-map-marker-alt mr-2"></i>Santiago, Chile</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 font-lato">
            <p>&copy; 2023 VetCare Chile. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
