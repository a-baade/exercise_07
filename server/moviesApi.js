import {Router} from "express";

export function MoviesApi(mongoDatabase) {
    const router = new Router();

    router.get("/", async (req, res) => {
        const database = mongoDatabase.collection("movies");
            const result = await database
                .find({
                    countries: {$in: ["Norway"] },
                    year: {$gte: 1999 },
                })
                .sort({ countries: -1 })
                .project({
                    title: 1,
                    plot: 2,
                    fullplot: 3,
                    directors: 4,
                    countries: 5,
                    poster: 6,
                    year: 7,
                })
                .limit(100)
                .toArray();
            res.json(result)
        });

    router.post("/api/movies/", async (req, res) => {
        const {title, year, directors, fullplot, countries} = req.body;
        const result = await mongoDatabase.collection("movies").insertOne({
            title,
            year,
            directors,
            fullplot,
            countries,
        });
        console.log({result});
        res.sendStatus(200)
    });

    return router;
}