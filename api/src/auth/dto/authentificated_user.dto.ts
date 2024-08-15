import { IsNotEmpty, IsString } from "class-validator";

export class AuthenticatedUserResponseDto {
  id!: number;
  is_premium!: boolean;
  username!: string;
  email!: string;
  nicename?: string;
  name?: string;
}

export class AuthenticatedUserDto {
  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  data!: AuthenticatedUserResponseDto;

  @IsString()
  token?: string;
}
