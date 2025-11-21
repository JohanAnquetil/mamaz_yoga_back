import { HttpException } from "@nestjs/common";
import { verifyPassword } from "./hash_verify_password";

// Returns if the user entered his password comparing with a hash
async function loginUser(password: string, storedHash: string): Promise<boolean> {
   if (!storedHash) return false;

  const isValid = await verifyPassword(password, storedHash);
  return isValid;
}

export { loginUser };
