import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from '../../util/http';
import { UserService } from '../../user/user.service';
import { comparePassword } from '../../util/crypto';
import { AuthType } from 'src/user/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const regex = new RegExp(['^', email, '$'].join(''), 'i');
    const user = await this.userService.findByEmail(regex);

    if (!user) {
      throw new HttpException(
        new CustomException('등록되지 않은 이메일입니다.'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    user.validateUserExit();

    user.validateAuthType(AuthType.email);

    const isSamePassword = await comparePassword(password, user.password);
    if (!isSamePassword) {
      throw new HttpException(
        new CustomException('Your password is incorrect.'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
