import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '../public')))

app.get("/", (req, res) => {
    console.log("get request");
    res.sendFile(path.join(__dirname, "../public/index.html"));
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})