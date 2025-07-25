import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthClientController } from './auth-client.controller';
import { AuthClientService } from './auth-client.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    // Import UsersModule to use UsersService
    UsersModule,

    // Configure Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT with dynamic secret from ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '60m' // Token expires in 60 minutes
        },
      }),
    }),
  ],
  controllers: [AuthClientController],
  providers: [
    AuthClientService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy
  ],
  exports: [AuthClientService, JwtModule], // Note the comma here
}) // Proper module closing
export class AuthClientModule { } // Added explicit class export