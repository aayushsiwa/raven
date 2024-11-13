const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors");

const app = express();
const port = 3000;

// Configure CORS middleware
app.use(cors());

// Dictionary of category feeds
const CATEGORY_FEEDS = {
    "android": "https://www.theverge.com/rss/android/index.xml",
    "apple": "https://www.theverge.com/rss/apple/index.xml",
    "apps": "https://www.theverge.com/rss/apps/index.xml",
    "climate": "https://www.theverge.com/rss/climate/index.xml",
    "crypto": "https://www.theverge.com/rss/crypto/index.xml",
    "creators": "https://www.theverge.com/rss/creators/index.xml",
    "cybersecurity": "https://www.theverge.com/rss/cybersecurity/index.xml",
    "deals": "https://www.theverge.com/rss/deals/index.xml",
    "decoder": "https://www.theverge.com/rss/decoder/index.xml",
    "elon-musk": "https://www.theverge.com/rss/elon-musk/index.xml",
    "facebook": "https://www.theverge.com/rss/facebook/index.xml",
    "film": "https://www.theverge.com/rss/film/index.xml",
    "gadgets": "https://www.theverge.com/rss/gadgets/index.xml",
    "gaming": "https://www.theverge.com/rss/gaming/index.xml",
    "google": "https://www.theverge.com/rss/google/index.xml",
    "hot-pod": "https://www.theverge.com/rss/hot-pod/index.xml",
    "how-to": "https://www.theverge.com/rss/how-to/index.xml",
    "meta": "https://www.theverge.com/rss/meta/index.xml",
    "microsoft": "https://www.theverge.com/rss/microsoft/index.xml",
    "policy": "https://www.theverge.com/rss/policy/index.xml",
    "reviews": "https://www.theverge.com/rss/reviews/index.xml",
    "samsung": "https://www.theverge.com/rss/samsung/index.xml",
    "science": "https://www.theverge.com/rss/science/index.xml",
    "space": "https://www.theverge.com/rss/space/index.xml",
    "streaming": "https://www.theverge.com/rss/streaming/index.xml",
    "tech": "https://www.theverge.com/rss/tech/index.xml",
    "tesla": "https://www.theverge.com/rss/tesla/index.xml",
    "the-vergecast": "https://www.theverge.com/rss/the-vergecast/index.xml",
    "tiktok": "https://www.theverge.com/rss/tiktok/index.xml",
    "transportation": "https://www.theverge.com/rss/transportation/index.xml",
    "tv-shows": "https://www.theverge.com/rss/tv-shows/index.xml",
    "twitter": "https://www.theverge.com/rss/twitter/index.xml",
    "youtube": "https://www.theverge.com/rss/youtube/index.xml",
};

// Function to fetch and parse RSS feed
async function fetchArticlesFromFeed(feedUrl) {
    try {
        const response = await axios.get(feedUrl);
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(response.data);
        const entries = result.feed.entry || [];

        const articles = entries.map((entry) => ({
            title: entry.title[0],
            link: entry.link[0].$.href,
            author: entry.author ? entry.author[0].name[0] : "Unknown",
            published: entry.updated[0],
            content: entry.content ? entry.content[0]._ : "",
        }));

        return articles;
    } catch (error) {
        throw new Error("Failed to fetch or parse feed");
    }
}

// Endpoint to list all categories with links
app.get("/", (req, res) => {
    let categoriesHtml = Object.keys(CATEGORY_FEEDS)
        .map((category) => {
            return `<li><a href="/verge-tech/${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</a></li>`;
        })
        .join("");

    res.send(`
    <html>
        <head>
            <title>The Verge Categories</title>
        </head>
        <body>
            <h1>Available Categories</h1>
            <ul>
                ${categoriesHtml}
            </ul>
        </body>
    </html>
    `);
});

// Dynamic route to fetch articles based on category
app.get("/verge-tech/:category", async (req, res) => {
    const category = req.params.category.toLowerCase();

    if (!(category in CATEGORY_FEEDS)) {
        return res.status(404).send("Category not found");
    }

    const feedUrl = CATEGORY_FEEDS[category];
    try {
        const articles = await fetchArticlesFromFeed(feedUrl);
        res.json(articles);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
