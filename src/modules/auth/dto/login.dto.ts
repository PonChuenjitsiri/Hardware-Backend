import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsNumber()
    id: string;
}