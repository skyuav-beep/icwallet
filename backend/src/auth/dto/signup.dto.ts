import { IsEmail, IsOptional, IsString, Length, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(10)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(9, 20)
  phone?: string;
}
