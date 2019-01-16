require('dotenv').config();
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
const MemoryStore = require('memorystore')(session);

const app = express();
const port = process.env.PORT || 8080;

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1000, // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port);

console.log('RESTful API server started on: ' + port);

// More graceful fallback
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});
