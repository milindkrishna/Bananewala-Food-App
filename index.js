const express = require('express');

// whenever we use bootstrap this will be helpful in layout
const expressLayout = require('express-ejs-layouts');

const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 3000;

// configure the dotenv
require('dotenv').config();

// for different middleware
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(expressLayout);

app.use(cookieParser('Bananewala'));
app.use(session({
  secret: 'BananewalaSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

// To setup view engine, you need the write this middleware
app.set('layout','./layouts/main');
app.set('view engine','ejs');

// add routes here to render
const routes = require('./server/routes/receipeRoutes')
app.use('/',routes);


// server listening config
app.listen(PORT,()=> console.log(`Listening to port ${PORT}`));