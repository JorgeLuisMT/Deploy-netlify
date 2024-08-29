import { createApp } from "./app.js";

import { MovieModel } from "../models/serverSQL/movie.js";

import ServerlessHttp from "serverless-http";

const api = createApp({ movieModel: MovieModel });

export const handler = ServerlessHttp(api);
