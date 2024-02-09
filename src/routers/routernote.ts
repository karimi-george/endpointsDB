import { Router, Request, Response } from "express";
import {
  creatingaNote,
  gettingallnotes,
  noteGettingById,
  noteUpdatingByID,
  noteDeletingById,
} from "../controllers/note";

const Noteroutes = Router();

Noteroutes.post("/", (req: Request, res: Response) => creatingaNote(req, res));
Noteroutes.get("/", (req: Request, res: Response) => gettingallnotes(req, res));
Noteroutes.get("/:id", (req: Request, res: Response) => noteGettingById(req, res));
Noteroutes.put("/:id", (req: Request, res: Response) => noteUpdatingByID(req, res));
Noteroutes.delete("/:id", (req: Request, res: Response) => noteDeletingById(req, res));

export {
  Noteroutes,
};
