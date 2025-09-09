import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async register(createUserDto: CreateUserDto) {
    try {
      const existUser = await this.findByEmail(createUserDto.email);

      if (existUser) {
        throw new Error('Email already exists');
      }

      const bcryptPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.db.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: bcryptPassword,
          firstname: createUserDto.firstname,
          lastname: createUserDto.lastname,
          tel: createUserDto.tel
        }
      })
      console.log(user);
      return user;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findByEmail(email: string) {
    return this.prisma.db.user.findUnique({
      where: {
        email: email
      }
    })
  }

  async findByUsername(username: string) {
    return this.prisma.db.user.findUnique({
      where: {
        user_name: username
      }
    })
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
