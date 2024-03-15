const express = require('express');
const app = express();
const { success } = require('./helper.js');
const { sequelize, db } = require('./config/sequelize.js');
const Post = require('./src/models/posts.js');
const PostMeta = require('./src/models/posts_meta.js');

// Appel des routes
require('./routes/get_published_posts')(app);
require('./routes/get_published_posts_by_pk')(app);

// Démarrage du serveur Express
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
