import express from "express";
import cors from "cors";
import ServerlessHttp from "serverless-http";
import { moviesRouter } from "../router/movies";
//import { movies } from "./movies.js";

const api = express();
api.disable("x-powered-by"); // deshabilitar este header

api.use(express.json());

//se usa el middleware cors para no tener que aceptar el origen en cada método

api.use(cors());

/* app.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  res.send(200);
}); */

api.use("/.netlify/functions/app/movies", moviesRouter);

const PORT = process.env.PORT ?? 3001;

//app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

export const handler = ServerlessHttp(api);
