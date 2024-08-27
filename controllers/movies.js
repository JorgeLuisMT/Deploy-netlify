import { MovieModel } from "../models/local-file-system/movie";

import { valudMovie, validPartialMovie } from "../schemes/scheme";

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query;

    const movies = await MovieModel.getAll({ genre });

    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;

    const movie = await MovieModel.getById({ id });

    if (movie) return res.json(movie);
    res.status(404).json({ message: "Movie not Found" });
  }

  static async create(req, res) {
    const result = valudMovie(req.body);

    if (!result.success) {
      return res.status(404).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });

    res.status(202).json(newMovie);
  }

  static async delete(req, res) {
    const { id } = req.params;

    const result = await MovieModel.delete({ id });

    if (result === false) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ message: "Movie deleted" });
  }

  static async update(req, res) {
    const result = validPartialMovie(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;

    const updatedMovie = await MovieModel.update({ id, input: result.data });

    return res.json(updatedMovie);
  }
}
