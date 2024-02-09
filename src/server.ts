import express, { Application } from "express";
import { Noteroutes } from "./routers/routernote";

const app: Application = express();

app.use(express.json());
app.use("/notes", Noteroutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});
