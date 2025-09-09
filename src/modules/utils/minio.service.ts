import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as Minio from 'minio';

@Injectable()
export class MinioService {

    private s3Client: S3Client;
    private readonly minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT || 'localhost',
        port: Number(process.env.MINIO_PORT) || 9000,
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
        secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: 'us-east-1',
            endpoint: this.configService.get<string>('MINIO_ENDPOINT', 'http://localhost:9000')!,
            credentials: {
                accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin')!,
                secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin')!,
            },
            forcePathStyle: true,
        });
    }

    async uploadFile(file: Express.Multer.File, bucketName: string): Promise<string> {
        try {
            const bucketExists = await this.minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                console.log(`Creating bucket: ${bucketName}`);
                await this.minioClient.makeBucket(bucketName, 'us-east-1'); 
                console.log(`Bucket created: ${bucketName}`);
            }
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = `product/${fileName}`;

            await this.minioClient.putObject(bucketName, filePath, file.buffer, file.size);

            console.log(`File uploaded: ${filePath}`);

            const minioHost = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
            const fileUrl = `${minioHost}/${bucketName}/${filePath}`;

            return fileUrl;
        } catch (error) {
            throw new Error(`MinIO Upload Failed: ${error.message}`);
        }
    }

    async uploadFiles(files: Express.Multer.File[], bucketName: string): Promise<string[]> {
        try {
            const bucketExists = await this.minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                console.log(`Creating bucket: ${bucketName}`);
                await this.minioClient.makeBucket(bucketName, 'us-east-1'); 
                console.log(`Bucket created: ${bucketName}`);
            }
    
            const uploadedUrls: string[] = [];
    
            for (const file of files) {
                const fileName = `${Date.now()}-${file.originalname}`;
                const filePath = `product/${fileName}`;
    
                await this.minioClient.putObject(bucketName, filePath, file.buffer, file.size);
                console.log(`File uploaded: ${filePath}`);
    
                const minioHost = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
                uploadedUrls.push(`${minioHost}/${bucketName}/${filePath}`);
            }
    
            return uploadedUrls;
        } catch (error) {
            throw new Error(`MinIO Upload Failed: ${error.message}`);
        }
    }
    
}
