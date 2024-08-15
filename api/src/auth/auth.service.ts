import { CreateUserDto } from "@app/users/dto/create_user.dto";
import { UsersService } from "@app/users/users.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthPayloadDto } from "../auth/dto/auth.dto";
import { UserLogin } from "./dto/user_login.dto";
import { UserWithPremium } from "./dto/user_with_premium.dto";
import { loginUser } from "./utils/login_user";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Validate if the user exists and if the provided login credentials are correct
  async validateUser({
    username,
    password,
  }: AuthPayloadDto): Promise<UserWithPremium> {
    const user: CreateUserDto | null =
      await this.usersService.findOneByLogin(username);

    if (!user) {
      throw new HttpException(
        `Utilisateur ou mot de passe inconnu`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userDetails = await this.usersService.findOne(user.id);
    const hasActivePremiumSubscription: boolean =
      userDetails?.data.has_active_premium_subscription ?? false;

    const isValid = loginUser(password, user.userPass);

    if (!isValid) {
      throw new HttpException(
        `Utilisateur ou mot de passe inconnu`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Créez un nouvel objet UserWithPremium en ajoutant is_premium
    const userWithPremium: UserWithPremium = {
      ...user, // Copie toutes les propriétés de l'objet user
      is_premium: hasActivePremiumSubscription, // Ajoute la propriété is_premium
    };

    return userWithPremium; // Retourne l'objet UserWithPremium
  }

  // // Validate if user exist and if the login is valid and correspond to the hash stored in database
  // async validateUser({ username, password }: AuthPayloadDto) {
  //   const user: any =
  //     await this.usersService.findOneByLogin(username);
  //   //const user: any = await this.usersService.findOneByLogin(username);

  //   if (user) {
  //     console.log({ user });
  //     const hasActivePremiumSubscription: boolean = await this.usersService
  //       .findOne(user.id)
  //       .then((user: any) => {
  //         return user.data.has_active_premium_subscription;
  //       });
  //     if (!user)
  //       throw new HttpException(
  //         `Utilisateur ou mot de passe inconnu`,
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //     const isValid = loginUser(password, user?.userPass);
  //     user["is_premium"] = hasActivePremiumSubscription ?? false;
  //     if (isValid) return user;
  //     else
  //       throw new HttpException(
  //         `Utilisateur ou mot de passe inconnu`,
  //         HttpStatus.UNAUTHORIZED,
  //       );
  //   }
  // }
  // Generate a token with JwtService
  generateToken(user: UserLogin): string {
    const payload = { id: user.id, is_premium: user.is_premium };
    return this.jwtService.sign(payload);
  }
}