const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('authDB.json');
const db = low(adapter);

const initDB = () =>{
  db.defaults({ users: {} })
    .write();
};

module.exports = {
  initDB,
  instance: db
};