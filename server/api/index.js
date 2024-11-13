const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

app.use(cors());

const VERGE_TECH_URL = "https://www.theverge.com/tech";

async function fetchVergeTechArticles() {
    try {
        const { data } = await axios.get(VERGE_TECH_URL);
        const $ = cheerio.load(data);
        // console.log("data", data);
        const articles = [];

        $(".duet--content-cards--content-card").each((index, element) => {
            // console.log("element", element);
            const title = $(element).find("h2 a").text().trim();
            const link = $(element).find("h2 a").attr("href");
            const author = $(element)
                // .find(".duet--content-cards--content-card-group a")
                .find(".duet--content-cards--content-card-group a")
                .first()
                .text()
                .trim();
                // console.log("author", author);
            const date = $(element).find("time").attr("datetime");
            const category = $(element)
                .find(".duet--content-cards--content-card-group a")
                .first()
                .text()
                .trim();

            if (title && link && author && date) {
                articles.push({
                    title,
                    link: `https://www.theverge.com${link}`, // Ensure the link is absolute
                    author,
                    date,
                    category,
                });
            }
        });

        return articles;
    } catch (error) {
        console.error("Error fetching The Verge tech articles:", error);
        throw error;
    }
}

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/verge-tech", async (req, res) => {
    // res.send("hi this is tech articles");
    try {
        const articles = await fetchVergeTechArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch articles" });
    }
});

app.listen(5001, () => console.log("Server ready on port 3000."));

module.exports = app;
