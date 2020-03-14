const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'brangi',
  database:'imageDB'
});

client.connect(err => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('DB connected')
  }
});

module.exports = {
  client
};
