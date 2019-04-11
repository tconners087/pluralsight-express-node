const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

/*
  To Study:
  passport, body-parser, cookie-parser

  GOODREADS:
  key: qUm9wyegDxrwxBCTGU2Zyw
  secret: iQxhbIHswA3R3ofIOw15r5SIWAzqOHhq31MVTirfl0
*/

const app = express();
const port = process.env.PORT || 3000;

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' },
  { link: '/auth/logout', title: 'LogOut' }
];

// MUST EXECUTE
const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);

// Logs useful stuff to console.
app.use(morgan('tiny'));

// Adds post to req.body? -- read more on this.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(expressSession({
  secret: 'library',
  name: 'lib_cookie',
  resave: true,
  saveUninitialized: true
}));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/popper')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  // Rendering from ./src/views
  res.render(
    'index',
    {
      nav,
      title: 'library'
    }
  );
});

app.listen(port, () => {
  debug(`listening at port ${chalk.green(port)}`);
});
