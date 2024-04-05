const express = require('express');
const { getAllMembers } = require('../services/member_service');
module.exports = (app) => {
    app.get('/api/members', async (req, res) => {
        try {
            const members = await getAllMembers();
            res.json(members);
        } catch (error) {
            console.error("Error fetching members:", error);
            res.status(500).send("An error occurred while fetching members.");
        }
    });
};