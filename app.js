const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./dbconfig');


dotenv.config({ path: './.env' });

const app = express();

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure Express to use Handlebars

app.set('view engine', 'hbs');

// Rest of your code...

db.connect((error) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Database connected successfully');
  }
});

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/usersData', require('./routes/auth'));

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
