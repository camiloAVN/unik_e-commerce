import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from '@/auth.config';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcrypt from 'bcryptjs';

// Por ahora simulamos la verificación sin DB
async function getUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return null;
  if (!user.password) return null; // user created via OAuth, no password
  if (!bcrypt.compareSync(password, user.password)) return null;
  const { password: _, ...rest } = user;
  return rest;
}

export const { 
  auth, 
  signIn, 
  signOut, 
  handlers 
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validar que lleguen los campos
        const parsedCredentials = z
          .object({ 
            email: z.string().email({ message: "Debe ser un email válido" }),
            password: z.string().min(6)
          })
          .safeParse(credentials);
          

        if (!parsedCredentials.success) {
          console.log('Invalid credentials format');
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log('Credentials recibidas:', { email, password });
        
        // Buscar usuario 
        const user = await getUser(email, password);
        
        if (!user) {
          console.log('User not found');
          return null;
        }

        // Retornar el usuario (sin password)
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // if (token && session.user) {
      //   session.user.id = token.id as string;
      // }
      session.user = token.data as any;
      return session;
    },
  },
});