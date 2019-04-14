// Dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

// Express app
const app = express();

// Adding CORS to avoid problems with external domains on API calls
app.use(cors());

// Creating a static public directory
app.use(express.static(path.resolve('./public')));

// Search results endpoint
app.get('/api/search/:term', (req, res) => {
  const { params: { term } } = req;

  const url = 'http://en.wikipedia.org/w/api.php';
  const endpoint = `${url}?action=query&list=search&srsearch=${term}&format=json`;

  // Perform API call and returns the response as JSON
  axios.get(endpoint)
    .then(response => res.json(response.data));
});

// Get page content endpoint
app.get('/api/page/:pageId', (req, res) => {
  const { params: { pageId } } = req;

  const url = 'https://en.wikipedia.org/w/api.php';
  const endpoint = `${url}?action=parse&pageid=${pageId}&format=json`;

  // Perform API call and returns the response as JSON
  axios.get(endpoint)
    .then(response => res.json(response.data));
});

// Rendering the index.html as our main page
app.get('/', (req, res) => res.sendFile(path.resolve('./index.html')));

// Listening to port 3000
app.listen(3000, () => console.log('Running on port 3000'));
