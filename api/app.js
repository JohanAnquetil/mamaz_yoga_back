const express = require('express');
const app = express();
require('dotenv').config({ path: './idapi.env' });
const mysql = require('mysql');

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'db',
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: 'mamazYoga2',
});

// //Configuration de la connexion à la base de données MySQL
// const db = mysql.createConnection({
//   host: 'joh80808080anahmamazyoga.mysql.db',
//   user: 'johanahmamazyoga',
//   password: 'ParisEstMagique75',
//   database: 'johanahmamazyoga',
// });


// Connexion à la base de données MySQL
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});

// Route Express pour récupérer les publications
app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM mod350_posts WHERE post_type = "post" AND post_status = "publish";';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des publications :', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des publications' });
    } else {
      res.json(results);
    }
  });
});

// Démarrage du serveur Express
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
