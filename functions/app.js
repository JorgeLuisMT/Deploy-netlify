import express, { Router } from "express";
import { randomUUID } from "node:crypto";
import { valudMovie, validPartialMovie } from "../schemes/scheme.js";
import cors from "cors";
import ServerlessHttp from "serverless-http";
import { movies } from "./movies.js";

const api = express();
const router = Router();
api.disable("x-powered-by"); // deshabilitar este header

api.use(express.json());

//se usa el middleware cors para no tener que aceptar el origen en cada método

api.use(cors());

router.get("/movies", (req, res) => {
  /*   const origin = req.header("origin");

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } */

  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );

    return res.json(filteredMovies);
  }

  res.json(movies);
});

router.get("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);

  res.status(404).json({ message: "Movie Not Found" });
});

router.post("/movies", (req, res) => {
  const result = valudMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

router.patch("/movies/:id", (req, res) => {
  const result = validPartialMovie(req.body);

  if (!result.success) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  let { id } = req.params;
  let movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  //funciona sin el return creo
  return res.json(updateMovie);
});

router.delete("/movies/:id", (req, res) => {
  /*  const origin = req.header("origin");

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } */
  const { id } = req.params;

  const deleteMovie = findIndex((movie) => movie.id === id);

  if (deleteMovie === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(deleteMovie, 1);

  return res.json({ message: "Pelicula eliminada" });
});

/* app.options("/movies/:id", (req, res) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  res.send(200);
}); */

api.use("/.netlify/functions/app/:splat", router);

const PORT = process.env.PORT ?? 3001;

//app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

export const handler = ServerlessHttp(api);
