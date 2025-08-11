const Booking = () => {
  const openCalendly = () => {
    // Open Calendly widget or redirect to Calendly page
    window.open('https://calendly.com/vetcare-chile', '_blank');
  };

  const paymentMethods = [
    { icon: "fas fa-credit-card", label: "Tarjetas", color: "text-mint" },
    { icon: "fas fa-university", label: "Transferencia", color: "text-lavender" },
    { icon: "fas fa-money-bill-wave", label: "Efectivo", color: "text-turquoise" },
    { icon: "fas fa-mobile-alt", label: "Red Compra", color: "text-palerose" }
  ];

  return (
    <section id="agendar" className="py-20 bg-gradient-to-br from-mint to-turquoise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-poppins font-bold text-white mb-6">Agenda tu Cita</h2>
        <p className="text-xl text-white font-lato mb-12 max-w-3xl mx-auto">
          Selecciona el día y hora que mejor te convenga. Nos pondremos en contacto contigo para confirmar los detalles.
        </p>
        
        {/* Calendly Integration */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto">
          <div className="text-center py-16">
            <i className="fas fa-calendar-alt text-6xl text-mint mb-6"></i>
            <h3 className="text-2xl font-poppins font-semibold text-darkgray mb-4">Calendario de Reservas</h3>
            <p className="text-gray-600 font-lato mb-8">Agenda tu cita de manera fácil y rápida</p>
            <button 
              onClick={openCalendly}
              className="bg-mint text-darkgray px-8 py-4 rounded-xl font-poppins font-semibold hover:shadow-lg transition-all"
            >
              <i className="fas fa-external-link-alt mr-2"></i>
              Abrir Calendario
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-16">
          <h3 className="text-2xl font-poppins font-semibold text-white mb-8">Métodos de Pago</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <i className={`${method.icon} text-3xl ${method.color} mb-3`}></i>
                <p className="font-poppins font-medium text-darkgray">{method.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
