const express = require('express');
const router = express.Router();
const extractFirstImageUrl = require('../utils/extract_image');
const Post = require('../src/models/posts');
const PostMeta = require('../src/models/posts_meta');
const extractIntroParagraph = require('../utils/extract_article_intro');

module.exports = (app) => {
  app.get('/api/posts', async (req, res) => {
  try {
      // Récupérer tous les posts publiés de la base de données avec leurs métadonnées Elementor
      const posts = await Post.findAll({
        where: {
          post_type: 'post',
          post_status: 'publish',
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
  
      const postsWithImagesAndIntro = posts.map(post => {
        // Initialiser avec des valeurs par défaut
        let imageUrl = null;
        let introParagraph = null;
  
        // Trouver les données Elementor dans les métadonnées du post
        const elementorData = post.PostMetas.find(meta => meta.meta_key === '_elementor_data')?.meta_value || '[]';
        const parsedData = JSON.parse(elementorData);
  
        // Extraire l'URL de la première image et le premier paragraphe d'introduction, si disponibles
        imageUrl = extractFirstImageUrl(parsedData);
        introParagraph = extractIntroParagraph(parsedData);
  
        return { 
          ...post.get({ plain: true }), 
          imageUrl, 
          introParagraph 
        };
      });
  
      res.json({ message: "Les publications ont été trouvées", posts: postsWithImagesAndIntro });
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des publications" });
    }
  });
}