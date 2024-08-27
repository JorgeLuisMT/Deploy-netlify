import { Router } from "express";

import { MovieController } from "../controllers/movies";

export const moviesRouter = Router();

moviesRouter.get("/", MovieController.getAll);
moviesRouter.post("/", MovieController.getAll);

moviesRouter.get("/:id", MovieController.getById);
moviesRouter.delete("/:id", MovieController.delete);
moviesRouter.patch("/:id", MovieController.update);
