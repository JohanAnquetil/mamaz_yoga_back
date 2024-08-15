// import * as utf8 from 'utf8';
// import { PasswordHash } from './test_hash';

// const len = 8;
// const portable = true;
// const phpversion = 7;

// async function hashPassword(password: any) {
//     const hasher = new PasswordHash(len, portable, phpversion);
//     const encodedPassword = utf8.encode(password);
//     try {
//         // Attendre la résolution de la promesse
//         const hashedPassword = await hasher.HashPassword(encodedPassword);
//         return hashedPassword; // Retourner le mot de passe haché
//     } catch (error) {
//         console.error("Erreur lors du hachage du mot de passe:", error);
//     }
// }

// function verifyPassword(password:any , storedHash: any) {
//     const hasher = new PasswordHash(len, portable, phpversion);
//     const encodedPassword = utf8.encode(password);
//     return hasher.CheckPassword(encodedPassword, storedHash);
// }

// export { hashPassword, verifyPassword };
