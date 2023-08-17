const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const POPE_NEWS_URL = 'https://www.vaticannews.va/en.html'; // URL for Vatican News website

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(POPE_NEWS_URL);
    const html = response.data;
    const $ = cheerio.load(html);

    const newsList = [];

    $('.vw-tile').each((index, element) => {
      const title = $(element).find('.vw-tile-title').text();
      const description = $(element).find('.vw-tile-summary').text();
      const link = $(element).find('.vw-tile-link').attr('href');

      newsList.push({
        title,
        description,
        link: `https://www.vaticannews.va${link}`
      });
    });

    res.send(`
      <html>
        <head>
          <title>Pope News</title>
        </head>
        <body>
          <h1>Latest Pope News</h1>
          <ul>
            ${newsList.map(news => `
              <li>
                <h3>${news.title}</h3>
                <p>${news.description}</p>
                <a href="${news.link}" target="_blank">Read more</a>
              </li>
            `).join('')}
          </ul>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error scraping news:', error);
    res.send('An error occurred while fetching the news.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
