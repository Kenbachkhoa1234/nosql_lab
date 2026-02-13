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
	if(db)
    console.log('Connected to MongoDB');
	else throw new Error('Failed to connect to MongoDB');
  })
  .catch(err => console.log(err));


// LOGIN (CÓ LỖI NoSQL Injection)
app.post('/login', (req, res) => {
  console.log("BODY:", req.body);
  console.log("TYPE USERNAME:", typeof req.body.username);
  console.log("TYPE PASSWORD:", typeof req.body.password);

  const { username } = req.body;
  const { password } = req.body;

   // const username = String(req.body.username);
   // const password = String(req.body.password);

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
