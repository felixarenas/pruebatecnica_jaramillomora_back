import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Importante para cargar las variables de entorno

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL, // Toma la URL desde el archivo .env
  },
  schema: './schema.prisma', // Ruta a tu archivo schema.prisma
});