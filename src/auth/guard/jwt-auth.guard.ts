import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomException } from '../../util/http';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: HttpException, user: any, info: any) {
    if (err || !user) {
      if (err instanceof HttpException) {
        throw new HttpException(
          new CustomException(err.message || '인증 오류가 발생했습니다.'),
          err.getStatus() || 401,
        );
      } else {
        throw new HttpException(
          new CustomException('인증 오류가 발생했습니다.'),
          401,
        );
      }
    }
    return user;
  }
}
