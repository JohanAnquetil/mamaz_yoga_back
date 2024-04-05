const express = require('express');
const app = express();
const { success } = require('./helper.js');
const { sequelize, db } = require('./config/sequelize.js');
const Post = require('./src/models/posts.js');
const PostMeta = require('./src/models/posts_meta.js');
const User = require('./src/models/users.js');
const Member = require('./src/models/members.js');

// Appel des routes
require('./routes/get_published_posts')(app);
require('./routes/get_published_posts_by_pk')(app);
require('./routes/get_users')(app);
require('./routes/get_members')(app);
require('./routes/get_member_by_mail.js')(app);
require('./routes/get_authentification.js')(app);

// Démarrage du serveur Express
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
