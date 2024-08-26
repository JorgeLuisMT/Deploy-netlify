const z = require("zod");

const movieScheme = z.object({
  title: z.string({
    required_error: "Movie title is requiered",
  }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: "Poster must be a valud url",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Adventure",
      "Crime",
      "Comedy",
      "Drama",
      "Fantasy",
      "Horror",
      "Thriller",
      "Sci-Fi",
    ]),
    {
      required_error: "Movie genre is required",
      invalid_type_error: "Movie genre must be an array of enum",
    }
  ),
});

function valudMovie(input) {
  return movieScheme.safeParse(input);
}

function validPartialMovie(input) {
  return movieScheme.partial().safeParse(input);
}

module.exports = {
  valudMovie,
  validPartialMovie,
};
