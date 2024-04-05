const User = require('../src/models/users');
const UserMeta = require('../src/models/users_meta');

async function getAllUsers() {
    try {
        const users = await User.findAll({
            include: [{
                model: UserMeta,
                as: 'UserMeta',
            }]
        });
        return users;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllUsers,
};
