import dotenv from "dotenv-safe";
dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: true,
});

export default {
  port: process.env.PORT,
  dbUrl: process.env.MY_DB_URL,
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  },
};
