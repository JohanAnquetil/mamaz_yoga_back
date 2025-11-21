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

    const isValid = await loginUser(password, user.userPass);
    console.log("Résultat de la validation de l'utilisateur :", isValid);

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

  generateToken(user: UserLogin): string {
    const payload = { id: user.id, is_premium: user.is_premium };
    return this.jwtService.sign(payload);
  }
}
