// utils/passwordUtils.js
const utf8 = require('utf8');
const PasswordHash = require('./test_hash.js').PasswordHash;

const len = 8;
const portable = true;
const phpversion = 7;

async function hashPassword(password) {
    const hasher = new PasswordHash(len, portable, phpversion); 
    const encodedPassword = utf8.encode(password);
    try {
        // Attendre la résolution de la promesse
        const hashedPassword = await hasher.HashPassword(encodedPassword);
        return hashedPassword; // Retourner le mot de passe haché
    } catch (error) {
        console.error("Erreur lors du hachage du mot de passe:", error);
    }
}

function verifyPassword(password, storedHash) {
    const hasher = new PasswordHash(len, portable, phpversion);
    const encodedPassword = utf8.encode(password);
    return hasher.CheckPassword(encodedPassword, storedHash);
}

module.exports = { hashPassword, verifyPassword };
