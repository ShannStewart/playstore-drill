const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('common')); // let's see what 'common' format looks like

app.use(cors());

const playstore = require('./playstore.js');

app.get('/', (req, res) => {
    console.log('The root path was called');
    res.send("Default page: nothing else here!");
});

app.get('/apps', (req, res) => {

    const { search = "", sort, genres } = req.query;

    if (sort) {
        if (!['app', 'rating'].includes(sort)) {
          return res
            .status(400)
            .send('Sort must be one of title or rank');
        }
      }

      if (genres){
        if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)) {
            return res
            .status(400)
            .send('Genre does not exist');
        }
    }

      let results = playstore
      .filter(play =>
        play
            .App
            .toLowerCase()
            .includes(search.toLowerCase()));

   if (genres) { results = results
    .filter(play =>
        play
            .Genres
            .toLowerCase()
            .includes(search.toLowerCase()));
        }

      if (sort) {
        results.sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });
      }

      res.json(results);
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
  });