import * as utf8 from "utf8";
import { PasswordHash } from "./password_hasher";

// Define constants for password hashing configuration

// The length of the salt used in hashing
const len = 8;
const portable = true;
const phpversion = 7;

// Hash a password using the specified hashing algorithm and UTF-8 encoding.
async function hashPassword(password: any) {
  const hasher = new PasswordHash(len, portable, phpversion);
  const encodedPassword = utf8.encode(password);
  try {
    const hashedPassword = await hasher.HashPassword(encodedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Erreur lors du hachage du mot de passe:", error);
  }
}
// Verify a password against a stored hash.
function verifyPassword(password: any, storedHash: any) {
  const hasher = new PasswordHash(len, portable, phpversion);
  const encodedPassword = utf8.encode(password);
  return hasher.CheckPassword(encodedPassword, storedHash);
}

export { hashPassword, verifyPassword };
