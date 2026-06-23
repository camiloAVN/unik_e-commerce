import { Resend } from 'resend';

// Instancia perezosa: el cliente Resend solo se construye la primera vez que
// realmente se usa (en tiempo de ejecución), no al importar el módulo. Esto
// evita que el build falle cuando RESEND_API_KEY no está disponible durante la
// fase de "collecting page data".
let client: Resend | null = null;

const getClient = (): Resend => {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
};

// Proxy que difiere la creación del cliente hasta el primer acceso a una
// propiedad (p. ej. `resend.emails.send(...)`), manteniendo la misma API.
export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

// Remitente por defecto / fallback.
export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'UNIK <noreply@unik.co>';

// Remitente para correos del e-commerce (recibos / confirmaciones de orden a clientes).
export const FROM_SALES = process.env.RESEND_FROM_SALES ?? FROM_EMAIL;

// Remitente para los correos manuales enviados desde el panel (ventana "Correo").
export const FROM_MANAGEMENT = process.env.RESEND_FROM_MANAGEMENT ?? FROM_EMAIL;
