import bcryptjs from 'bcryptjs';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

interface SeedCategory {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
}

interface SeedProduct {
  title: string;
  description: string;
  inStock: number;
  price: number;
  slug: string;
  tags: string[];
  images: string[];
  categorySlug: string;
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
  products: SeedProduct[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'camilo@gmail.com',
      name: 'Camilo Andres Vargas',
      password: bcryptjs.hashSync('1234567'),
      role: 'admin',
    },
    {
      email: 'paula@gmail.com',
      name: 'Paula Bolivar',
      password: bcryptjs.hashSync('1234567'),
      role: 'user',
    },
  ],

  categories: [
    { name: 'Ropa',        slug: 'ropa',        description: 'Prendas de vestir importadas',    isActive: true, sortOrder: 1 },
    { name: 'Accesorios',  slug: 'accesorios',  description: 'Accesorios y complementos',       isActive: true, sortOrder: 2 },
    { name: 'Electrónica', slug: 'electronica', description: 'Dispositivos y gadgets',          isActive: true, sortOrder: 3 },
    { name: 'Hogar',       slug: 'hogar',       description: 'Artículos para el hogar',         isActive: true, sortOrder: 4 },
    { name: 'Belleza',     slug: 'belleza',     description: 'Cuidado personal y cosmética',    isActive: true, sortOrder: 5 },
  ],

  products: [
    {
      title: 'Camiseta Premium UNIK',
      description: 'Camiseta de algodón premium importada. Confección de alta calidad con materiales seleccionados para máxima comodidad.',
      inStock: 25,
      price: 89000,
      slug: 'camiseta-premium-unik',
      tags: ['camiseta', 'algodón', 'premium'],
      images: ['no-image.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Chaqueta Casual Importada',
      description: 'Chaqueta casual de temporada, importada directamente. Material resistente al viento con interior suave.',
      inStock: 12,
      price: 245000,
      slug: 'chaqueta-casual-importada',
      tags: ['chaqueta', 'casual', 'importada'],
      images: ['no-image.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Reloj Minimalista',
      description: 'Reloj de diseño minimalista con correa intercambiable. Movimiento japonés de precisión.',
      inStock: 8,
      price: 320000,
      slug: 'reloj-minimalista',
      tags: ['reloj', 'minimalista', 'acero'],
      images: ['no-image.jpg'],
      categorySlug: 'accesorios',
    },
    {
      title: 'Audífonos Inalámbricos',
      description: 'Audífonos bluetooth con cancelación de ruido activa. Batería de 30 horas de duración.',
      inStock: 15,
      price: 580000,
      slug: 'audifonos-inalambricos',
      tags: ['audífonos', 'bluetooth', 'inalámbrico'],
      images: ['no-image.jpg'],
      categorySlug: 'electronica',
    },
    {
      title: 'Crema Hidratante Premium',
      description: 'Crema hidratante de lujo con ingredientes naturales importados. Para todo tipo de piel.',
      inStock: 30,
      price: 125000,
      slug: 'crema-hidratante-premium',
      tags: ['crema', 'hidratante', 'skincare'],
      images: ['no-image.jpg'],
      categorySlug: 'belleza',
    },
  ],
};
