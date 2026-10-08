import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend Medios Educativos funcionando",
  });
});

app.get("/api/campus", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM campus ORDER BY id_campus"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar los campus",
    });
  }
});
app.get("/api/programas", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM programa ORDER BY id_programa"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al consultar los programas",
    });
  }
});

pool.query("SELECT NOW()")
  .then(() => console.log("Conexión con PostgreSQL correcta"))
  .catch((error) =>
    console.error("Error de conexión con PostgreSQL:", error)
  );

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});