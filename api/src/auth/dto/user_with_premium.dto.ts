import { CreateUserDto } from "@app/users/dto/create_user.dto";

export class UserWithPremium extends CreateUserDto {
  is_premium!: boolean;
}
