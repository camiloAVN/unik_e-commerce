import { FaWhatsapp } from 'react-icons/fa';

const PHONE = '573143767295'; // formato internacional sin + ni espacios
const MESSAGE = 'Hola, estoy interesado en sus productos.';

const HREF = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export function WhatsAppButton() {
  return (
    <a
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
      title="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:bg-[#1ebe5d] hover:scale-105 transition-all duration-200"
    >
      <FaWhatsapp className="w-7 h-7" />
      <span className="absolute inline-flex w-full h-full rounded-full bg-[#25D366] opacity-60 animate-ping -z-10" />
    </a>
  );
}
