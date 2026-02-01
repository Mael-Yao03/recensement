import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import {
  Person,
  MemberDetails,
  ChildDetails,
  Image,
  User,
  Role,
  Permission,
} from './entities';

// Services
import {
  FileService,
  MemberService,
  ChildService,
  AuthService,
  UserService,
  RoleService,
  DashboardService,
  SeedService,
} from './services';

// Controllers
import {
  MemberController,
  ChildController,
  AuthController,
  UserController,
  RoleController,
  DashboardController,
} from './controllers';

// Guards
import { JwtStrategy, JwtAuthGuard, PermissionsGuard } from './guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'transfiguration-secret-key-2024',
        signOptions: { expiresIn: '24h' },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [
        Person,
        MemberDetails,
        ChildDetails,
        Image,
        User,
        Role,
        Permission,
      ],
      synchronize: true, // À désactiver en production
      logging: true,
    }),
    TypeOrmModule.forFeature([
      Person,
      MemberDetails,
      ChildDetails,
      Image,
      User,
      Role,
      Permission,
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'pictures'),
      serveRoot: '/pictures',
    }),
  ],
  controllers: [
    AppController,
    MemberController,
    ChildController,
    AuthController,
    UserController,
    RoleController,
    DashboardController,
  ],
  providers: [
    AppService,
    FileService,
    MemberService,
    ChildService,
    AuthService,
    UserService,
    RoleService,
    DashboardService,
    SeedService,
    JwtStrategy,
    JwtAuthGuard,
    PermissionsGuard,
  ],
})
export class AppModule {}
