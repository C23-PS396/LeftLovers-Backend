import { db_host, db_name, db_password, db_port, db_user } from "./config";

const database = {
  dialect: "postgres",
  database: db_name,
  host: db_host,
  port: db_port,
  username: db_user,
  password: db_password,
};

export default database;
