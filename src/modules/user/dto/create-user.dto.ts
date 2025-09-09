import {IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter a valid email'})
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    tel?: string;
}
