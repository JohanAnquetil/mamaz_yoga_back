const express = require('express');
const { getPublishedPosts } = require('../services/post_service');

module.exports = (app) => {
  app.get('/api/posts', async (req, res) => {
    try {
      const posts = await getPublishedPosts();
      res.json({ message: "Les publications ont été trouvées", posts });
    } catch (error) {
      console.error('Erreur lors de la récupération des publications:', error);
      res.status(500).json({ message: "Erreur lors de la récupération des publications" });
    }
  });
}