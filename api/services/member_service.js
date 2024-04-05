const { Op } = require('sequelize');
const Member = require('../src/models/members');
const UserMeta = require('../src/models/users_meta');

async function findMemberByEmailOrLogin(email, login) {
    try {
        const user = await Member.findOne({
            where: {
                [Op.or]: [
                    email ? { arm_user_email: { [Op.like]: `%${email}%` } } : undefined,
                    login ? { arm_user_nicename: { [Op.like]: `%${login}%` } } : undefined
                ].filter(Boolean)
            },
            include: [{
                model: UserMeta,
                as: 'UserMeta',
            }]
        });

        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error; // Rethrow l'erreur pour la gestion d'erreur à un niveau plus élevé
    }
}

async function getAllMembers() {
    try {
        const members = await Member.findAll({});
        return members;
    } catch (error) {
        throw error;
    }
}

module.exports = { findMemberByEmailOrLogin, getAllMembers };
