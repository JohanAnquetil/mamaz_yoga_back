const express = require('express');
const router = express.Router();
const extractFirstImageUrl = require('../utils/extract_image');
const Post = require('../src/models/posts');
const PostMeta = require('../src/models/posts_meta');
const extractIntroParagraph = require('../utils/extract_article_intro');

module.exports = (app) => {
  app.get('/api/posts/:id', async (req, res) => {
    const id = req.params.id
  try {
      // Récupérer tous les posts publiés de la base de données avec leurs métadonnées Elementor
      const post = await Post.findOne({
        where: {
          post_type: 'post',
          post_status: 'publish',
          id: id,
        },
        include: [{
          model: PostMeta,
          as: 'PostMetas',
          required: false,
          where: {
            meta_key: '_elementor_data',
          }
        }]
      });

      if (!post) {
        return res.status(404).send('Post not found');
      }
      const postByPk = { 
        id: post.id,
        title: post.post_title,
        content: post.post_content,
        metadata: post.PostMetas,
        author: post.post_author
      }

      res.json({ message: "Les publications ont été trouvées", post: postByPk
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des publications" });
    }
  });
}