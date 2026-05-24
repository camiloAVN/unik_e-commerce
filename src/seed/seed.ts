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
      title: 'Camiseta Clásica Importada',
      description: 'Camiseta de algodón 100% importada. Corte regular, acabados de alta calidad y suavidad excepcional. Ideal para el día a día.',
      inStock: 30,
      price: 89000,
      slug: 'camiseta-clasica-importada',
      tags: ['camiseta', 'algodón', 'básica'],
      images: ['1740226-00-A_0_2000.jpg', '1740226-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Camiseta Oversize Premium',
      description: 'Camiseta oversize de corte holgado. Tela gruesa importada, perfecta para looks casuales con mucho estilo.',
      inStock: 20,
      price: 105000,
      slug: 'camiseta-oversize-premium',
      tags: ['camiseta', 'oversize', 'casual'],
      images: ['1740211-00-A_0_2000.jpg', '1740211-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Sudadera con Capucha',
      description: 'Sudadera con capucha importada. Forro interno suave, bolsillo canguro y cordones ajustables. Perfecta para el frío.',
      inStock: 15,
      price: 198000,
      slug: 'sudadera-con-capucha',
      tags: ['sudadera', 'hoodie', 'capucha'],
      images: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Pantalón Jogger Cómodo',
      description: 'Pantalón jogger importado, cintura elástica y puños ajustados. Tela suave y resistente, ideal para el uso diario.',
      inStock: 18,
      price: 145000,
      slug: 'pantalon-jogger-comodo',
      tags: ['pantalón', 'jogger', 'sport'],
      images: ['1740535-00-A_0_2000.jpg', '1740535-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Chaqueta Cortaviento',
      description: 'Chaqueta cortaviento importada. Material impermeable ligero, cierre frontal y bolsillos laterales con cremallera.',
      inStock: 10,
      price: 265000,
      slug: 'chaqueta-cortaviento',
      tags: ['chaqueta', 'cortaviento', 'impermeable'],
      images: ['1657916-00-A_0_2000.jpg', '1657916-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Camiseta Estampada Edición',
      description: 'Camiseta de edición especial con estampado exclusivo. Tela de algodón peinado importada, colores de larga duración.',
      inStock: 22,
      price: 115000,
      slug: 'camiseta-estampada-edicion',
      tags: ['camiseta', 'estampada', 'edición especial'],
      images: ['1657932-00-A_0_2000.jpg', '1657932-00-A_1.jpg'],
      categorySlug: 'ropa',
    },
    {
      title: 'Gorra Snapback Importada',
      description: 'Gorra snapback ajustable. Panel frontal estructurado, bordado en 3D y cierre trasero plástico ajustable.',
      inStock: 35,
      price: 75000,
      slug: 'gorra-snapback-importada',
      tags: ['gorra', 'snapback', 'accesorios'],
      images: ['1740406-00-A_0_2000.jpg', '1740407-00-A_0_2000.jpg'],
      categorySlug: 'accesorios',
    },
    {
      title: 'Bolso Urbano Compacto',
      description: 'Bolso urbano de material resistente importado. Múltiples compartimentos, correa ajustable y cierre de seguridad.',
      inStock: 12,
      price: 185000,
      slug: 'bolso-urbano-compacto',
      tags: ['bolso', 'urbano', 'accesorios'],
      images: ['1740408-00-A_0_2000.jpg', '1740408-00-A_1.jpg'],
      categorySlug: 'accesorios',
    },
    {
      title: 'Cinturón de Cuero Premium',
      description: 'Cinturón de cuero genuino importado. Hebilla metálica clásica, múltiples tallas disponibles y acabado de alta durabilidad.',
      inStock: 25,
      price: 95000,
      slug: 'cinturon-cuero-premium',
      tags: ['cinturón', 'cuero', 'accesorios'],
      images: ['1740411-00-A_0_2000.jpg', '1740411-00-A_1.jpg'],
      categorySlug: 'accesorios',
    },
    {
      title: 'Audífonos Inalámbricos Pro',
      description: 'Audífonos bluetooth con cancelación de ruido activa. Batería de 30 horas, diadema acolchada y audio de alta fidelidad.',
      inStock: 8,
      price: 580000,
      slug: 'audifonos-inalambricos-pro',
      tags: ['audífonos', 'bluetooth', 'inalámbrico'],
      images: ['100042307_0_2000.jpg', '100042307_1_2000.jpg'],
      categorySlug: 'electronica',
    },
    {
      title: 'Lámpara de Escritorio LED',
      description: 'Lámpara LED de escritorio importada. Luz regulable en 3 tonos, USB integrado para carga y brazo flexible ajustable.',
      inStock: 14,
      price: 220000,
      slug: 'lampara-escritorio-led',
      tags: ['lámpara', 'led', 'escritorio'],
      images: ['8765120-00-A_0_2000.jpg', '8765120-00-A_1.jpg'],
      categorySlug: 'hogar',
    },
    {
      title: 'Crema Hidratante Premium',
      description: 'Crema hidratante de lujo con ingredientes naturales importados. Fórmula sin parabenos para todo tipo de piel.',
      inStock: 40,
      price: 125000,
      slug: 'crema-hidratante-premium',
      tags: ['crema', 'hidratante', 'skincare'],
      images: ['5645685-00-A_0_2000.jpg'],
      categorySlug: 'belleza',
    },
  ],
};
