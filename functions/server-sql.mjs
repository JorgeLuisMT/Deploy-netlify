import { createApp } from "./app.js";

import { MovieModel } from "../models/serverSQL/movie.js";

import ServerlessHttp from "serverless-http";

const apii = createApp({ movieModel: MovieModel });

export const handler = ServerlessHttp(apii);
