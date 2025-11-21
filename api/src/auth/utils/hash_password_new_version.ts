import crypto from "crypto";
import bcrypt from "bcrypt";

export async function verifyWpPassword(
  password: string,
  hash: string
): Promise<boolean> {
  console.log("Vérification du mot de passe avec le hash dans verify password :", hash);

  // WordPress modern hash: $wp$2y$...
  if (hash.startsWith("$wp")) {

    // WordPress does NOT trim() here (trim only used on hash creation)
    const hmac = crypto
      .createHmac("sha384", "wp-sha384")
      .update(password)
      .digest();

    const transformed = Buffer.from(hmac).toString("base64");

    // Remove $wp prefix → "$2y$..."
    let realHash = hash.slice(3);

    // Node bcrypt patch: convert $2y$ → $2b$
    realHash = realHash.replace(/^\$2y\$/, "$2b$");
    console.log("Mot de passe transformé pour bcrypt:", transformed);
    console.log("Hash réel après transformation:", realHash);
    return bcrypt.compare(transformed, realHash);
  }

  // Native bcrypt PHP ($2y$)
  if (hash.startsWith("$2y$")) {
    const realHash = hash.replace(/^\$2y\$/, "$2b$");
    return bcrypt.compare(password, realHash);
  }

  return false;
}