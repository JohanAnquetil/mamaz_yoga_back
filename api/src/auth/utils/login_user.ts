import { HttpException } from "@nestjs/common";
import { verifyPassword } from "./hash_verify_password";

// Returns if the user entered his password comparing with a hash
async function loginUser(password: string, storedHash: string): Promise<boolean> {
  const isValid = await verifyPassword(password, storedHash);
  if (!isValid) {
    throw new HttpException(`Utilisateur ou mot de passe inconnu`, 401);
  }
  return isValid;
}

export { loginUser };
