import express from "express";
import morgan from "morgan";
import puntosRoutes from "./routes/puntos.routes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());

app.use(puntosRoutes);

export default app;
