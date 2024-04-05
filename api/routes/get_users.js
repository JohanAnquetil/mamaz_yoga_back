const express = require('express');
const { getAllUsers } = require('../services/user_service');

module.exports = (app) => {
    app.get('/api/users', async (req, res) => {
        try {
            const users = await getAllUsers();
            res.json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("An error occurred while fetching users.");
        }
    });
};
