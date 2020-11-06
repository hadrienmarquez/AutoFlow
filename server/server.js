import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

const PORT = process.env.PORT || 8080;

server.use(express.static(path.join(__dirname, "client")));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
