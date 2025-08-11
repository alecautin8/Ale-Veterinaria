import { useState } from 'react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqItems = [
    {
      question: "¿Qué servicios incluye una consulta domiciliaria?",
      answer: "Incluye examen físico completo, diagnóstico, plan de tratamiento, y seguimiento. También proporcionamos certificados cuando sea necesario.",
      gradient: "from-turquoise to-mint"
    },
    {
      question: "¿Atienden emergencias?",
      answer: "Sí, tenemos disponibilidad para emergencias. Contáctanos al WhatsApp y evaluaremos la urgencia de tu caso.",
      gradient: "from-lavender to-palerose"
    },
    {
      question: "¿Cómo accedo a los portales?",
      answer: "Los tutores y veterinarios tienen portales separados con acceso mediante email y contraseña. Te proporcionamos las credenciales tras la primera consulta.",
      gradient: "from-palerose to-turquoise"
    },
    {
      question: "¿Cuál es el costo de una consulta?",
      answer: "Los precios varían según el tipo de consulta y ubicación. Contáctanos para obtener una cotización personalizada.",
      gradient: "from-mint to-lavender"
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold text-darkgray mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-gray-600">Resolvemos las dudas más comunes</p>
        </div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className={`bg-gradient-to-r ${item.gradient} p-6 rounded-xl shadow-lg`}>
              <button 
                className="w-full text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-xl font-poppins font-semibold text-darkgray">{item.question}</h3>
                <i className={`fas fa-chevron-down text-darkgray transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}></i>
              </button>
              {openFAQ === index && (
                <div className="mt-4 text-darkgray font-lato leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
