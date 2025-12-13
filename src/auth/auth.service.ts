import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, socialId: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.socialId !== socialId) {
      throw new UnauthorizedException('Invalid credentials');
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
