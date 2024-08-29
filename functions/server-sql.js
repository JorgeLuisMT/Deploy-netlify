import { createApp } from "./app.js";

import { MovieModel } from "../models/serverSQL/movie.js";

import ServerlessHttp from "serverless-http";

createApp({ movieModel: MovieModel });
