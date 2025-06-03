import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto){
        return this.authService.register(dto.name,dto.email,dto.password)
    }

    @Post('login')
    login(@Body() dto: LoginDto){
        return this.authService.login(dto.email,dto.password)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return {
        userId: req.user.userId,
        email: req.user.email,
        name: req.user.name,
        };
    }
}