const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.render('index.ejs');
});

app.listen(3000, () => {
  console.log('Working successfully! Port : 3000');
});
