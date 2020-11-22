import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from '../app.service';
import { VerificationSchema } from './schemas/verification.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './guard/local.strategy';
import { JwtStrategy } from './guard/jwt.strategy';
import { jwtConstants } from './constants';
import { UserModule } from '../user/user.module';
import { TokenblacklistSchema } from './schemas/tokenblacklist.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      {
        name: 'verifications',
        schema: VerificationSchema,
        collection: 'verifications',
      },
      {
        name: 'tokenblacklists',
        schema: TokenblacklistSchema,
        collection: 'tokenblacklists',
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
