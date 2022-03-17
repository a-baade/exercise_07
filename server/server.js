import express from "express";
import * as path from "path";
import {MongoClient} from "mongodb"
import bodyParser from "body-parser";
import dotenv from "dotenv"
import {MoviesApi} from "./moviesApi.js";

dotenv.config();
const app = express();

app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
    app.use("/api/movies", MoviesApi(mongoClient.db(process.env.MONGODB_DATABASE)))
})



app.use(express.static("../client/dist/"));

app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        res.sendFile(path.resolve("../client/dist/index.html"));
    }else {
        next();
    }
});

const server = app.listen(3000, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});