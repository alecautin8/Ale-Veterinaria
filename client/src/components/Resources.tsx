const Resources = () => {
  const resources = [
    {
      title: "Guía de Cuidado Básico",
      description: "Consejos esenciales para el cuidado diario de tu mascota",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      action: "Descargar PDF",
      icon: "fas fa-download",
      color: "text-mint"
    },
    {
      title: "Calendario de Vacunación",
      description: "Programa completo de vacunas por edad",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      action: "Ver Calendario",
      icon: "fas fa-calendar-alt",
      color: "text-lavender"
    },
    {
      title: "Primeros Auxilios",
      description: "Qué hacer en situaciones de emergencia",
      image: "https://images.unsplash.com/photo-1581888227599-779811939961?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      action: "Leer Guía",
      icon: "fas fa-first-aid",
      color: "text-turquoise"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-warmbeige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold text-darkgray mb-4">Recursos para Tutores</h2>
          <p className="text-xl text-gray-600">Información útil para el cuidado de tu mascota</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="rounded-xl w-full h-48 object-cover mb-4" 
                />
                <h3 className="text-2xl font-poppins font-semibold text-darkgray mb-3">{resource.title}</h3>
                <p className="text-gray-600 font-lato">{resource.description}</p>
              </div>
              <button className={`inline-flex items-center ${resource.color} font-poppins font-medium hover:underline`}>
                <i className={`${resource.icon} mr-2`}></i>
                {resource.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
