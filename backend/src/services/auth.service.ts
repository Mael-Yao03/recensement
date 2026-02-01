import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roleId: string;
  roleName: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: {
      id: string;
      name: string;
      permissions: string[];
    };
  };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
      relations: ['role', 'role.permissions'],
    });

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Mettre à jour la date de dernière connexion
    await this.userRepository.update(user.id, { lastLoginAt: new Date() });

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roleId: user.role.id,
      roleName: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: {
          id: user.role.id,
          name: user.role.name,
          permissions: user.role.permissions.map((p) => p.name),
        },
      },
    };
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['role', 'role.permissions'],
      });
      return user && user.isActive ? user : null;
    } catch {
      return null;
    }
  }

  async getProfile(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'role.permissions'],
    });
  }
}
