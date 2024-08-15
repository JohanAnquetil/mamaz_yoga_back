import { SubscriptionPlansModule } from "@app/subscription_plans/subscription_plans.module";
import { UsersModule } from "@app/users/users.module";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
//import { MatchingUsernamePassword } from "./utils/matching_username_password";
import { PasswordHash } from "./utils/password_hasher";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    SubscriptionPlansModule,
    JwtModule.register({
      secret: "abc123",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // MatchingUsernamePassword,
    PasswordHash,
  ],
  exports: [AuthModule],
})
export class AuthModule {}
