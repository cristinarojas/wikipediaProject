const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const app = express();

app.use(cors());

app.use(express.static(path.resolve('./public')));

app.get('/api/search/:term', (req, res) => {
  const { params: { term } } = req;

  const url = 'http://en.wikipedia.org/w/api.php';
  const endpoint = `${url}?action=query&list=search&srsearch=${term}&format=json`;
  console.log('ENDPOINT===', endpoint);
  axios.get(endpoint)
    .then(response => res.json(response.data));
});

app.get('/', (req, res) => res.sendFile(path.resolve('./index.html')));

app.listen(3000, () => console.log('Running on port 3000'));
