import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class memberAccountData {
  @IsOptional()
  @IsString()
  genre?: string;

  @IsEmail()
  email!: string;

  @IsString()
  login!: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsString()
  password!: string;

  @IsBoolean()
  has_active_premium_subscription!: boolean;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  surnom?: string;

  @IsString()
  nom_a_afficher?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  capacite?: string;

  @IsOptional()
  @IsString()
  expiration_plan?: string;

  @IsOptional()
  @IsString()
  capacité?: string;

  @IsString()
  plan_actuel!: any;

  @IsString()
  options_du_plan!: string;

  @IsOptional()
  @IsString()
  user_status?: number;
}
