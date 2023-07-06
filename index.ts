import express from "express";
import { json } from "body-parser";
import { router } from "./route";

export const app = express();


app.use(json());
app.use(express.static("files"));

app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
