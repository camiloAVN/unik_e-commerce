'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function login(
  prevState: string | undefined,
  formData: FormData
) {
  const email    = (formData.get('email')    as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string);

  if (!email || !password) return 'Completa todos los campos';

  try {
    await signIn('credentials', { email, password, redirect: false });
    return 'Success';
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Correo o contraseña incorrectos';
        case 'CallbackRouteError':
          return 'Error de conexión. Verifica que la base de datos esté activa.';
        default:
          return 'Ocurrió un error. Inténtalo de nuevo.';
      }
    }
    throw error;
  }
}

export const loginData = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password, redirect: false });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo iniciar sesión' };
  }
};
