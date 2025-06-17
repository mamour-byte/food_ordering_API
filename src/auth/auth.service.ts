import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      return user;
    }
    throw new UnauthorizedException('Email ou mot de passe invalide');
  }

  async login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: UserRole;
  }) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new UnauthorizedException('Email déjà utilisé');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.create({
      ...data,
      passwordHash,
    });

    return this.login(newUser);
  }
}
