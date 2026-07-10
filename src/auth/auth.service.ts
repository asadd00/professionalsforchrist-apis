import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { SocialLoginDto } from './dto/social-login.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(body: LoginDto) {
    const user = await this.usersService.findByEmailAndLoginType(body.email, 'email');

    if (!user || !user.password || !(await bcrypt.compare(body.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active, please contact support');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });

    const { password, ...safeUser } = user;
    return { ...safeUser, accessToken: token };
  }

  async socialLogin(body: SocialLoginDto) {
    const user = await this.usersService.create(body);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User is not active, please contact support');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1d',
    });

    return { ...user, accessToken: token };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
