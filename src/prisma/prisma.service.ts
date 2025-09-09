import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService {
  
    private prisma : PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    get db(){
        return this.prisma;
    }
}
