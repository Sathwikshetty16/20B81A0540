const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.json());

const fetchNumbersFromURL = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.status === 200) {
      return response.data.numbers || [];
    } else {
      throw new Error('Failed to fetch data');
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
    return [];
  }
};

app.get('/numbers', async (req, res) => {
  const urls = Array.isArray(req.query.url) ? req.query.url : [];

  if (!urls.length) {
    res.status(400).json({ error: 'Invalid URL parameter' });
    return;
  }

  const promises = urls.map(fetchNumbersFromURL);

  try {
    const results = await Promise.all(promises);
    const uniqueNumbers = [...new Set(results.flat())].sort((a, b) => a - b);

    res.json({ numbers: uniqueNumbers });
  } catch (error) {
    console.error(`Internal server error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
