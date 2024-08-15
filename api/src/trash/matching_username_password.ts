// Come from AUTH / UTILS

// import { UsersService } from "@app/users/users.service";
// import { Injectable } from "@nestjs/common";
// import * as utf8 from "utf8";
// import { PasswordHash } from "./password_hasher";

// const len = 8;
// const portable = true;
// const phpversion = 7;

// @Injectable()
// export class MatchingUsernamePassword {
//   constructor(
//     private readonly usersService: UsersService,
//     private readonly passwordHash: PasswordHash,
//   ) {}

//   //     async valideLoginUsernameWithPassword(username: string) {
//   //     const user = await this.usersService.findOneByLogin(username);
//   //     console.log(user)

//   //     if (user) {
//   //     console.log(user.userPass)
//   //     console.log(user.userEmail)
//   //     }
//   // }

//   loginUser(password: string, storedHash: string): boolean {
//     const isValid = this.verifyPassword(password, storedHash);
//     if (isValid) {
//       console.log("Authentification réussie");
//       // Procéder à l'authentification de l'utilisateur
//     } else {
//       console.log("Échec de l'authentification");
//       // Gérer l'échec de l'authentification
//     }
//     return isValid;
//   }

//   async hashPassword(password: string) {
//     //const hasher = new PasswordHash(len, portable, phpversion);
//     const encodedPassword = utf8.encode(password);
//     try {
//       // Attendre la résolution de la promesse
//       const hashedPassword =
//         await this.passwordHash.HashPassword(encodedPassword);
//       return hashedPassword;
//     } catch (error) {
//       console.error("Erreur lors du hachage du mot de passe:", error);
//     }
//   }

//   verifyPassword(password: any, storedHash: any): boolean {
//     //const hasher = new PasswordHash(len, portable, phpversion);
//     const encodedPassword = utf8.encode(password);
//     return this.passwordHash.CheckPassword(encodedPassword, storedHash);
//   }
// }
