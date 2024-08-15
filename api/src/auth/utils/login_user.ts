import { HttpException } from "@nestjs/common";
import { verifyPassword } from "./hash_verify_password";

// Returns if the user entered his password comparing with a hash
function loginUser(password: string, storedHash: string): boolean {
  const isValid = verifyPassword(password, storedHash);
  if (!isValid) {
    throw new HttpException(`Utilisateur ou mot de passe inconnu`, 401);
  }
  return isValid;
}

export { loginUser };
