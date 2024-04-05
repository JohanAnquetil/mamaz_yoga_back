const express = require('express');
const { findMemberByEmailOrLogin } = require('../services/member_service.js');


module.exports = (app) => {
    app.get('/api/member', async (req, res) => {
        const { email, login } = req.query;

        if (!email && !login) {
            return res.status(400).send("Email or login is required");
        }

        try {
            const user = await findMemberByEmailOrLogin(email, login);
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.json(user);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("An error occurred while fetching users.");
        }
    });
};
