import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from '../app.service';
import { Verification } from './schemas/verification.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';
import { jwtConstants } from './constants';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { Tokenblacklist } from './schemas/tokenblacklist.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: Tokenblacklist,
        schemaOptions: {
          timestamps: true,
        },
      },
      {
        typegooseClass: Verification,
        schemaOptions: {
          timestamps: true,
        },
      },
    ]),
    PassportModule,
    MailModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AppService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
