const About = () => {
  return (
    <section id="quien-soy" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-poppins font-bold text-darkgray mb-6">Dra. Alejandra Cautin</h2>
            <p className="text-lg text-gray-600 font-lato leading-relaxed">
              Con más de 10 años de experiencia en medicina veterinaria, me especializo en atención domiciliaria porque creo que las mascotas se sienten más cómodas y seguras en su hogar.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-mint p-3 rounded-full">
                  <i className="fas fa-graduation-cap text-darkgray text-xl"></i>
                </div>
                <div>
                  <h4 className="font-poppins font-semibold text-darkgray">Veterinaria Universidad de Chile</h4>
                  <p className="text-gray-600 font-lato">Titulada con distinción máxima</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-lavender p-3 rounded-full">
                  <i className="fas fa-certificate text-darkgray text-xl"></i>
                </div>
                <div>
                  <h4 className="font-poppins font-semibold text-darkgray">Especialización en Medicina Interna</h4>
                  <p className="text-gray-600 font-lato">Diplomado en pequeños animales</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-turquoise p-3 rounded-full">
                  <i className="fas fa-heart text-darkgray text-xl"></i>
                </div>
                <div>
                  <h4 className="font-poppins font-semibold text-darkgray">10+ años de experiencia</h4>
                  <p className="text-gray-600 font-lato">Más de 5000 mascotas atendidas</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Dra. María González veterinaria" 
              className="rounded-3xl shadow-2xl w-full h-auto" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
