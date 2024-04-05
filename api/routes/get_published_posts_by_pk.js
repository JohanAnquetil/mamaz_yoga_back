const express = require('express');
const { getPublishedPostById } = require('../services/post_service');

module.exports = (app) => {
    app.get('/api/posts/:id', async (req, res) => {
        try {
            const post = await getPublishedPostById(req.params.id);
            res.json({ message: "La publication a été trouvée", post });
        } catch (error) {
            if (error.message === 'Post not found') {
                return res.status(404).json({ message: "Publication non trouvée" });
            }
            console.error('Erreur lors de la récupération de la publication:', error);
            res.status(500).json({ message: "Erreur lors de la récupération de la publication" });
        }
    });
}