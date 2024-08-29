import { createApp } from "./app.js";

import { MovieModel } from "../models/serverSQL/movie.js";

createApp({ movieModel: MovieModel });
