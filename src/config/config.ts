import * as dotenv from "dotenv";

dotenv.config({
  path: `${__dirname}/../../.env`,
});

export const port = Number(process.env.API_PORT);
export const db_host = String(process.env.DB_HOST);
export const db_port = Number(process.env.DB_PORT);
export const db_name = String(process.env.DB_NAME);
export const db_user = String(process.env.DB_USER);
export const db_password = String(process.env.DB_PASSWORD);

export const secret = String(process.env.SECRET);
export const go_api_key = String(process.env.GO_API_KEY);
export const go_api_url = String(process.env.GO_API_URL);
