const { hashPassword, verifyPassword } = require('../utils/password_utils.js');

async function createUser(password) {
    const hashedPassword = await hashPassword(password);
    console.log("Mot de passe haché:", hashedPassword);
    // Insérer l'utilisateur et le mot de passe haché dans la base de données
    return hashedPassword;
}

function loginUser(password, storedHash) {
    const isValid = verifyPassword(password, storedHash);
    if (isValid) {
        console.log("Authentification réussie");
        // Procéder à l'authentification de l'utilisateur
    } else {
        console.log("Échec de l'authentification");
        // Gérer l'échec de l'authentification
    }
    return isValid;
}

module.exports = { createUser, loginUser };
