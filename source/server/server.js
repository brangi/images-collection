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

const dbAuth = require('./authDB');
dbAuth.initDB();

(async () => {

  app.post('/signup', async (req, res) => {
    const {user, pass} = req.body;
    //Save in auth db
    if(dbAuth.instance.get(`users.${user}`).value()){
      return res.status(403).send('User already taken');
    } else{
      dbAuth.instance.set(`users.${user}`, pass).write();
      return res.json({ 'message': "user created" });
    }
  });

  app.post('/login', (req, res) => {
    const {user, pass} = req.body;
    if(dbAuth.instance.get(`users.${user}`).value()){
      const passFound = dbAuth.instance.get(`users.${user}`).value();
      if(passFound !== pass)return res.sendStatus(404);
      return res.json({ 'message': "authorized" });
    } else{
      return res.sendStatus(404);
    }
  });

  app.use(basicAuth({
    users: dbAuth.instance.get('users').value()
  }));

  app.post('/check', async (req, res) => {
    res.json({hello: 'world'})
  });

  app.post('/image', async (req, res) => {
    //Search userId
    const sqlUser = "SELECT user_id FROM users WHERE username = $1";
    const valuesUser = [req.auth && req.auth.user];
    const user = await client.query(sqlUser, valuesUser);
    const posterId = user.rows[0].user_id;
    //Insert image data
    const sqlImage = 'INSERT INTO images' +
      '(image_name, image_url, poster) ' +
      'VALUES($1, $2, $3 ) ' +
      'RETURNING *';
    const valuesImage = [req.body.name,req.body.url , posterId];
    const image = await client.query(sqlImage, valuesImage);
    res.json(image.rows[0])
  });

  app.get('/image/collection', async (req, res) => {
    //Get images
    const sqlImage = "SELECT images.image_id, images.image_name, images.image_url, " +
      "users.username, images.created_at  FROM images  " +
      "INNER JOIN users ON users.user_id = images.poster;";
    const images = await client.query(sqlImage);
    res.json(images.rows)
  });

  app.get('/image/:id', async (req, res) => {
    //Search image
    const sqlImage = "SELECT * FROM images WHERE image_id = $1";
    const valuesId = [req.params && Number(req.params.id)];
    const image = await client.query(sqlImage, valuesId);
    res.json(image.rows[0])
  });

  app.listen(8080);
  console.log('======== Server 8080======');
})();
