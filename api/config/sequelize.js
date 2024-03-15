const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

// Configuration de Sequelize pour se connecter à la base de données
const sequelize = new Sequelize('mamazYoga2', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'db',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'mamazYoga2',
});

db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données MySQL :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = {sequelize, db};
