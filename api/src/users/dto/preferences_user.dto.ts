import { ArrayNotEmpty, IsArray, IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PreferencesUserDTO {
  @IsNotEmpty()
  @IsNumber()
  readonly user_id!: number;

  @IsNotEmpty()
  @IsArray() // Valide que c'est un tableau
  @ArrayNotEmpty() // Vérifie que le tableau n'est pas vide
  @IsNumber({}, { each: true }) 
  readonly tags_id!: Array<number>;
}
