const express = require('express');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'shop_lab';

let db;

MongoClient.connect(url)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');

    return db.collection('users').deleteMany({});
  })
  .then(() => {
    return db.collection('users').insertMany([
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: '123456', role: 'user' }
    ]);
  })
  .then(() => console.log('Sample users created'))
  .catch(err => console.log(err));


// LOGIN (CÓ LỖI NoSQL Injection)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.collection('users').findOne({
    username: username,
    password: password
  })
  .then(user => {
    if (user) {
      res.json({ success: true, role: user.role });
    } else {
      res.json({ success: false });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
