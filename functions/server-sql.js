import { createApp } from "./app.js";

import { MovieModel } from "../models/serverSQL/movie.js";

import ServerlessHttp from "serverless-http";

export const handler = ServerlessHttp(createApp({ movieModel: MovieModel }));
