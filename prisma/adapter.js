import { PrismaMariaDb } from '@prisma/adapter-mariadb'


export const adapter = new PrismaMariaDb(
  {
    connectionLimit: 5,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
  },
  { schema: process.env.DB_NAME }
) 