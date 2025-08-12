import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WhatsAppService } from '@/lib/whatsapp';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the form data to your backend or email service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto",
      });
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWhatsAppClick = () => {
    const message = `Hola! Me gustaría obtener más información sobre los servicios veterinarios a domicilio de VetCare Chile.

¿Podrían ayudarme con:
- Información sobre servicios disponibles
- Precios y horarios
- Agendar una consulta

Gracias!`;

    WhatsAppService.openWhatsApp("+56912345678", message);
  };

  const contactInfo = [
    {
      icon: "fas fa-phone",
      title: "Teléfono",
      value: "+56 9 1234 5678",
      color: "bg-mint",
      action: () => window.open("tel:+56912345678")
    },
    {
      icon: "fas fa-envelope",
      title: "Email",
      value: "info@vetcarechile.com",
      color: "bg-lavender",
      action: () => window.open("mailto:info@vetcarechile.com")
    },
    {
      icon: "fab fa-whatsapp",
      title: "WhatsApp",
      value: "+56 9 1234 5678",
      color: "bg-green-500",
      action: handleWhatsAppClick
    },
    {
      icon: "fas fa-clock",
      title: "Horarios",
      value: "Lun-Vie: 8:00-20:00 | Sáb: 9:00-14:00",
      color: "bg-palerose"
    }
  ];

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-poppins font-bold text-darkgray mb-4">Contacto</h2>
          <p className="text-xl text-gray-600">Estamos aquí para ayudarte y resolver tus dudas</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-4 ${info.action ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                onClick={info.action}
              >
                <div className={`${info.color} p-4 rounded-full ${info.action ? 'hover:shadow-lg' : ''}`}>
                  <i className={`${info.icon} text-white text-2xl`}></i>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-darkgray text-xl">{info.title}</h3>
                  <p className="text-gray-600 font-lato">{info.value}</p>
                  {info.title === "WhatsApp" && (
                    <p className="text-sm text-green-600 font-lato mt-1">¡Haz clic para chatear!</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-warmbeige to-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-poppins font-semibold text-darkgray mb-6">Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-darkgray font-poppins font-medium mb-2">Nombre completo *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-mint focus:outline-none font-lato" 
                  placeholder="Tu nombre" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-darkgray font-poppins font-medium mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-lavender focus:outline-none font-lato" 
                  placeholder="tu@email.com" 
                  required
                />
              </div>
              
              <div>
                <label className="block text-darkgray font-poppins font-medium mb-2">Teléfono</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-turquoise focus:outline-none font-lato" 
                  placeholder="+56 9 1234 5678" 
                />
              </div>
              
              <div>
                <label className="block text-darkgray font-poppins font-medium mb-2">Mensaje *</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-palerose focus:outline-none font-lato" 
                  placeholder="Cuéntanos sobre tu mascota y cómo podemos ayudarte"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-mint text-darkgray py-4 px-8 rounded-xl font-poppins font-semibold hover:shadow-lg transition-all"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
