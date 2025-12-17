import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import { SocialLoginDto } from './dto/social-login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async socialLogin(body: SocialLoginDto) {
    const user = await this.usersService.create(body);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not active, please contact support');
    }

    const payload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });

    return { ...user, access_token: token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
