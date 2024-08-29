import { createApp } from "./functions/app.js";
import ServerlessHttp from "serverless-http";
import { MovieModel } from "./models/serverSQL/movie.js";

export const handler = ServerlessHttp(createApp({ movieModel: MovieModel }));
