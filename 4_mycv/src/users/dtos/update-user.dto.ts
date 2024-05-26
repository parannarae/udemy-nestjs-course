import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()   // can be optional
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}
