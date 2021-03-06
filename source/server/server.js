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
      //Save in imagesDB
      const sqlImage = 'INSERT INTO users' +
        '(username, password) ' +
        'VALUES($1, $2) ' +
        'RETURNING *';
      const valuesImage = [user, pass ];
      const userNew = await client.query(sqlImage, valuesImage);
      return res.json(userNew.rows[0]);
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
    const sqlUser = "SELECT user_id FROM users WHERE username = $1";
    const valuesUser = [req.auth && req.auth.user];
    const user = await client.query(sqlUser, valuesUser);
    const posterId = user.rows[0].user_id;
    const sqlImage = 'INSERT INTO images' +
      '(image_name, image_url, poster) ' +
      'VALUES($1, $2, $3 ) ' +
      'RETURNING *';
    const valuesImage = [req.body.name,req.body.url , posterId];
    const image = await client.query(sqlImage, valuesImage);
    res.json(image.rows[0])
  });

  app.post('/image/:imageId/comment', async (req, res) => {
    const sqlUser = "SELECT user_id FROM users WHERE username = $1";
    const valuesUser = [req.auth && req.auth.user];
    const user = await client.query(sqlUser, valuesUser);
    const posterId = user.rows[0].user_id;
    const sqlImage = 'INSERT INTO comments' +
      '(comment, commenter, image_id) ' +
      'VALUES($1, $2, $3 ) ' +
      'RETURNING *';
    const valuesImage = [req.body.comment, posterId , req.params.imageId];
    const image = await client.query(sqlImage, valuesImage);
    res.json(image.rows[0])
  });

  app.put('/image/:imageId/name', async (req, res) => {
    const sql = "UPDATE images SET image_name = $1 WHERE image_id = $2" +
      " RETURNING *";
    const values = [req.body.name, req.params.imageId];
    const image = await client.query(sql, values);
    res.json(image.rows[0])
  });

  app.get('/image/collection', async (req, res) => {
    let sqlImage = "SELECT images.image_id, images.image_name, images.image_url, " +
      "users.username, images.created_at  FROM images  " +
      "INNER JOIN users ON users.user_id = images.poster";
    if(req.query && req.query.sort ==='name'){
      sqlImage = `${sqlImage} ORDER BY images.image_name ASC`
    }
    if(req.query && req.query.sort ==='date'){
      sqlImage = `${sqlImage} ORDER BY images.created_at DESC`
    }
    const images = await client.query(sqlImage);
    res.json(images.rows)
  });

  app.get('/image/:id', async (req, res) => {
    const sqlImage = "SELECT images.image_id, images.image_name, images.image_url," +
      " images.created_at, images.poster, users.username FROM images " +
      "INNER JOIN users ON users.user_id = images.poster " +
      "WHERE image_id = $1";
    const valuesId = [req.params && Number(req.params.id)];
    const image = await client.query(sqlImage, valuesId);
    const sqlComments = "SELECT comments.comment, comments.commenter, comments.image_id, " +
      "users.username, comments.created_at FROM comments INNER JOIN users ON users.user_id = comments.commenter" +
      " WHERE image_id = $1" +
      " ORDER BY comments.created_at DESC;";
    const comments = await client.query(sqlComments, valuesId);
    res.json({
      "image_id": image.rows[0].image_id,
      "image_name": image.rows[0].image_name,
      "image_url": image.rows[0].image_url,
      "poster": image.rows[0].username,
      "created_at": image.rows[0].created_at,
      "comments":  comments.rows,
    })
  });

  app.get('/search/image', async (req, res) => {
    //Search
    const sqlImage = `SELECT DISTINCT image_name, image_id, created_at, poster ` +
      `FROM images WHERE LOWER(image_name) LIKE LOWER('%${req.query.name}%');`;
    const images = await client.query(sqlImage);
    res.json(images.rows)
  });

  app.listen(8080);
  console.log('======== Server 8080======');
})();
