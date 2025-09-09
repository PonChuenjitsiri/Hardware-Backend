import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
    ) { }
    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        console.log(user);
        if (user && user.password && (await bcrypt.compare(password, user.password))) {
            return {
                username: user.userName,
                id: user.id,
            }
        }

        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async googleLogin(req): Promise<any> {
        let createUser
        if (!req.user) {
            throw new Error('Google login failed: No user information received.');
        }

        const { email, name, picture, googleId } = req.user;
        let user = await this.prismaService.db.user.findUnique({
            where: {
                googleId: googleId,
            },
        })

        if (!user) {
            createUser = await this.prismaService.db.user.create({
                data: {
                    email,
                    userName: name,
                    firstName: name,
                    lastName: name,
                    googleId,
                    pictureUrl: picture,
                },
            })
        }

        const payload = { username: user?.userName };

        return {
            access_token: this.jwtService.sign(payload),
            createUser : createUser
        };
    }
}
