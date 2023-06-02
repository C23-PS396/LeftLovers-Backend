import * as dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.API_PORT);
export const DB_HOST = String(process.env.DB_HOST);
export const DB_PORT = Number(process.env.DB_PORT);
export const DB_NAME = String(process.env.DB_NAME);
export const DB_USER = String(process.env.DB_USER);
export const DB_PASSWORD = String(process.env.DB_PASSWORD);
export const DATABASE_URL = String(process.env.DATABASE_URL);

export const SECRET = String(process.env.SECRET);
export const GO_API_KEY = String(process.env.GO_API_KEY);
export const GO_API_URL = String(process.env.GO_API_URL);
export const ILUMA_API_URL = String(process.env.ILUMA_API_URL);
export const ILUMA_API_KEY = String(process.env.ILUMA_API_KEY);

export const BUCKET_NAME = String(process.env.BUCKET_NAME);
export const GOOGLE_APPLICATION_CREDENTIALS = String(
  process.env.GOOGLE_APPLICATION_CREDENTIALS
);
