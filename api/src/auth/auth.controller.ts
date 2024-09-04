import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  AuthenticatedUserDto,
  AuthenticatedUserResponseDto,
} from "./dto/authentificated_user.dto";
import { UserLogin } from "./dto/user_login.dto";
import { LocalGuard } from "./guards/local.guards";

@Controller("login")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Protect this route with the LocalGuard, which verifies the user's credentials.
  @UseGuards(LocalGuard)
  @Post()

  // Handles user login, returning account information and a token if the user has a premium subscription.
  login(@Request() req: { user: UserLogin }): AuthenticatedUserDto {
    let token: string | null = null;
    if (req.user.is_premium) {
      token = this.authService.generateToken(req.user);
    }
    let response: AuthenticatedUserResponseDto = {
      id: req.user.id,
      is_premium: req.user.is_premium,
      username: req.user.userNicename,
      email: req.user.userEmail,
      nicename: req.user.userNicename,
      name: req.user.displayName,
    };
    if (token) token = token;
    return {
      message: "L'authentification est validée !!",
      data: response,
      token: token ?? undefined, // Use undefined if no token is generated because use hasn't a premium subscription.
    };
  }
}
