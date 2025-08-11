const Services = () => {
  const services = [
    {
      icon: "fas fa-stethoscope",
      title: "Consultas Generales",
      description: "Exámenes de rutina, diagnósticos y tratamientos en la comodidad de tu hogar.",
      features: ["Examen físico completo", "Diagnóstico profesional", "Plan de tratamiento"],
      gradient: "from-mint to-turquoise",
      textColor: "text-white"
    },
    {
      icon: "fas fa-syringe",
      title: "Vacunación",
      description: "Plan completo de vacunación y certificados oficiales.",
      features: ["Vacunas Zoetis y MSD/Nobivac", "Certificados automáticos", "Seguimiento personalizado"],
      gradient: "from-lavender to-palerose",
      textColor: "text-darkgray"
    },
    {
      icon: "fas fa-pills",
      title: "Desparasitación",
      description: "Tratamientos preventivos y curativos contra parásitos internos y externos.",
      features: ["Evaluación parasitaria", "Tratamiento específico", "Plan preventivo"],
      gradient: "from-palerose to-turquoise",
      textColor: "text-darkgray"
    },
    {
      icon: "fas fa-file-medical",
      title: "Certificados",
      description: "Emisión de certificados sanitarios y de exportación oficial.",
      features: ["Certificados de salud", "Certificados de exportación", "Documentación oficial"],
      gradient: "from-turquoise to-mint",
      textColor: "text-darkgray"
    },
    {
      icon: "fas fa-microscope",
      title: "Exámenes",
      description: "Análisis de laboratorio y exámenes complementarios.",
      features: ["Análisis de sangre", "Exámenes de orina", "Estudios especializados"],
      gradient: "from-palerose to-lavender",
      textColor: "text-darkgray"
    },
    {
      icon: "fas fa-home",
      title: "Atención Domiciliaria",
      description: "Comodidad total para tu mascota en su ambiente familiar.",
      features: ["Sin estrés para tu mascota", "Atención personalizada", "Equipos portátiles"],
      gradient: "from-mint to-palerose",
      textColor: "text-darkgray"
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold text-darkgray mb-4">Nuestros Servicios</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Ofrecemos atención integral para tu mascota sin salir de casa</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className={`bg-gradient-to-br ${service.gradient} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all`}>
              <div className={`${service.textColor} mb-6`}>
                <i className={`${service.icon} text-4xl mb-4`}></i>
                <h3 className="text-2xl font-poppins font-semibold mb-3">{service.title}</h3>
                <p className="font-lato">{service.description}</p>
              </div>
              <ul className={`${service.textColor} space-y-2 font-lato`}>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <i className="fas fa-check-circle mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
