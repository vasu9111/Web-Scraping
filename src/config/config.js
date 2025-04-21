import dotenv from "dotenv-safe";
dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: true,
});

export default {
  port: process.env.PORT,
  dbUrl: process.env.MY_DB_URL,
};
