import { Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { MerchantAuthGuard } from './merchant-auth.guard';
import { errorResponse, successResponse } from '../utils/response.util';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Req() req, @Res({ passthrough: true }) res) {
        try {
            const access_token = await this.authService.login(req.user);
            console.log(req.user);
            res.cookie('access_token', access_token.access_token, { httpOnly: true });
            return successResponse(access_token, "Login Successful");
        } catch (err) {
            throw new HttpException(
                errorResponse(
                    'User login failed',
                    err.message || HttpStatus.INTERNAL_SERVER_ERROR,
                ),
                HttpStatus.BAD_REQUEST,
            );
        }

    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) {
        // Initiates the Google OAuth process
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res) {
        const access_token = await this.authService.googleLogin(req);
        res.cookie('access_token', access_token.access_token, { httpOnly: true });
        return {
            message: "Login successful",
        };
    }

    // @Get('logout')
    // async logout(@Req() req, @Res() res) {
    //     res.clearCookie('access_token', {
    //         httpOnly: true,
    //     });
    //     return res.json({ message: 'Successfully logged out' });
    // }

    @Post('logout')
    logout(@Res() res) {
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
        return successResponse({ message: 'Successfully logged out' });
    }

}
