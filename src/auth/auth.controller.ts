import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailSignupDto } from './dto/email-signup.dto';
import { SendVerificationCodeDto } from './dto/send-verificaion-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { User } from '../user/schemas/user.schema';
import { AuthService } from './auth.service';
import { ApiResponse } from '../util/http';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ReqUser } from '../decorator/user.decorator';
import { AUTH_COOKIE_NAME, cookieOptions } from '../util/http';
import { FindPasswordDto } from './dto/find-password.dto';
import { SnsSignupDto } from './dto/sns-signup-dto';
import { SnsLoginDto } from './dto/sns-login-dto';
import { getCurrentDate } from '../util/date';
import { VerificationType } from './schemas/verification.schema';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login/email')
  async loginWithEmail(
    @ReqUser() user: User,
    @Res() res: Response,
  ): Promise<any> {
    const accessToken = this.authService.login(user);
    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);
    return res.json(
      ApiResponse.createSuccessApiResponse('이메일 로그인 되었습니다.', {
        user,
        accessToken,
      }),
    );
  }

  @HttpCode(200)
  @Post('/login/google')
  async googleLogin(
    @Body() snsLoginDto: SnsLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const { user, accessToken } = await this.authService.googleLogin(
      snsLoginDto,
    );
    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);
    return res.json(
      ApiResponse.createSuccessApiResponse('구글 로그인 되었습니다.', {
        user,
        accessToken,
      }),
    );
  }

  @HttpCode(200)
  @Post('/login/facebook')
  async facebookLogin(
    @Body() snsLoginDto: SnsLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const { user, accessToken } = await this.authService.facebookLogin(
      snsLoginDto,
    );
    res.cookie(AUTH_COOKIE_NAME, accessToken, cookieOptions);
    return res.json(
      ApiResponse.createSuccessApiResponse('페이스북 로그인 되었습니다.', {
        user,
        accessToken,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    await this.authService.logout(req);
    res.cookie(AUTH_COOKIE_NAME, '', {
      ...cookieOptions,
      expires: getCurrentDate(),
    });
    return res.json(
      ApiResponse.createSuccessApiResponse('로그아웃 되었습니다.'),
    );
  }

  @HttpCode(201)
  @Post('/signup/email')
  async emailSignup(
    @Body() emailSignupDto: EmailSignupDto,
  ): Promise<ApiResponse> {
    const savedUser = await this.authService.emailSignup(emailSignupDto);
    return ApiResponse.createSuccessApiResponse(
      '이메일 회원가입 되었습니다.',
      savedUser,
    );
  }

  @HttpCode(201)
  @Post('/signup/google')
  async googleSignup(@Body() snsSignupDto: SnsSignupDto): Promise<ApiResponse> {
    const savedUser = await this.authService.googleSignup(snsSignupDto);
    return ApiResponse.createSuccessApiResponse(
      '구글 로그인을 통한 회원가입 되었습니다.',
      savedUser,
    );
  }

  @HttpCode(201)
  @Post('/signup/facebook')
  async facebookSignup(
    @Body() snsSignupDto: SnsSignupDto,
  ): Promise<ApiResponse> {
    const savedUser = await this.authService.facebookSignup(snsSignupDto);
    return ApiResponse.createSuccessApiResponse(
      '페이스북 로그인을 통한 회원가입 되었습니다.',
      savedUser,
    );
  }

  @HttpCode(200)
  @Post('/verification/signup/send')
  async sendVerificationCodeForSignup(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ): Promise<ApiResponse> {
    await this.authService.sendVerificationCodeForSignup(
      sendVerificationCodeDto.email,
    );
    return ApiResponse.createSuccessApiResponse('인증번호가 전송되었습니다.');
  }

  @HttpCode(200)
  @Post('/verification/signup/verify')
  async verifyCodeForSignup(
    @Body() verifyCodeDto: VerifyCodeDto,
  ): Promise<ApiResponse> {
    await this.authService.verifyEmail(
      verifyCodeDto.email,
      verifyCodeDto.verificationCode,
      VerificationType.SIGNUP,
    );
    return ApiResponse.createSuccessApiResponse('인증되었습니다.');
  }

  @HttpCode(200)
  @Post('/verification/find-password/send')
  async sendVerificationCodeForFindPassword(
    @Body() sendVerificationCodeDto: SendVerificationCodeDto,
  ): Promise<ApiResponse> {
    await this.authService.sendVerificationCodeForFindPassword(
      sendVerificationCodeDto.email,
    );
    return ApiResponse.createSuccessApiResponse('인증번호가 전송되었습니다.');
  }

  @HttpCode(200)
  @Post('/verification/find-password/verify')
  async verifyCodeForFindPassword(
    @Body() verifyCodeDto: VerifyCodeDto,
  ): Promise<ApiResponse> {
    await this.authService.verifyEmail(
      verifyCodeDto.email,
      verifyCodeDto.verificationCode,
      VerificationType.FIND_PASSWORD,
    );
    return ApiResponse.createSuccessApiResponse('인증되었습니다.');
  }

  @HttpCode(200)
  @Put('/find/password')
  async findPassword(@Body() findPasswordDto: FindPasswordDto): Promise<any> {
    await this.authService.findPassword(findPasswordDto);
    return ApiResponse.createSuccessApiResponse('비밀번호가 변경되었습니다.');
  }
}
