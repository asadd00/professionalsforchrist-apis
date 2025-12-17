import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SocialLoginDto } from "./dto/social-login.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('social')
    socialLogin(@Body() body: SocialLoginDto) {
        return this.authService.socialLogin(body);
    }
}