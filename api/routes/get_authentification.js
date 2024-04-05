const express = require('express');
const { createUser, loginUser } = require('../services/hash_service');

module.exports = (app) => {
    app.get('/api/login', async (req, res) => {
        const storedhash = '$P$B6yRjzKn6zvSnEAqa8Rw21NxK5McLj.';
        const password = 'JOHANMAMAZA';

        await createUser(password);
        const isValid = loginUser(password, storedhash);

        res.send(isValid ? "Authentification réussie!" : "Échec de l'authentification");
    });
};