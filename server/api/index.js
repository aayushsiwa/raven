const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');  // Import the cors package

const app = express();
const PORT = 80;

// Enable CORS for all routes (or configure it as needed)
app.use(cors());  // This enables CORS for all requests

const VERGE_TECH_URL = 'https://www.theverge.com/tech';

// Function to fetch and parse articles from The Verge
async function fetchVergeTechArticles() {
  try {
    const { data } = await axios.get(VERGE_TECH_URL);
    const $ = cheerio.load(data);

    const articles = [];

    $('.duet--content-cards--content-card').each((index, element) => {
      const title = $(element).find('h2 a').text().trim();
      const link = $(element).find('h2 a').attr('href');
      const author = $(element).find('.duet--content-cards--content-card-group a').first().text().trim();
      const date = $(element).find('time').attr('datetime');
      const category = $(element).find('.duet--content-cards--content-card-group a').first().text().trim();

      if (title && link && author && date) {
        articles.push({
          title,
          link: `https://www.theverge.com${link}`,  // Ensure the link is absolute
          author,
          date,
          category
        });
      }
    });

    return articles;

  } catch (error) {
    console.error('Error fetching The Verge tech articles:', error);
    throw error;
  }
}

app.get('/api/tech-articles', async (req, res) => {
  try {
    const articles = await fetchVergeTechArticles();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
