const express = require('express');
const cors = require('cors');
const util = require('util');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

const {client} = require('./db');
client.query = util.promisify(client.query);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

(async () => {
  let usersAuth = {};
  const usersDB = await client.query('SELECT * from users');
  usersDB.rows.forEach(usr =>{
     usersAuth[usr.username] = usr.password
  });
  app.use(basicAuth({
    users: usersAuth
  }));
  app.post('/signup', async (req, res) => {
    res.json({hello: 'world'})
  });
  app.listen(8080);
  console.log('======== Server 8080======');
})();
