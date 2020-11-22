import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '../util/http';
import { ReqUser } from '../decorator/user.decorator';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ChangeInfoDto } from './dto/change-info.dto';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Get('check')
  async check(@ReqUser() user: User): Promise<ApiResponse> {
    return ApiResponse.createSuccessApiResponse('유저 확인 성공', user);
  }

  @HttpCode(200)
  @Put('info')
  async changeInfo(
    @ReqUser() user: User,
    @Body() changeInfoDto: ChangeInfoDto,
  ): Promise<ApiResponse> {
    const changedUser = await this.userService.changeInfo(user, changeInfoDto);
    return ApiResponse.createSuccessApiResponse(
      '인증번호가 전송되었습니다.',
      changedUser,
    );
  }

  @HttpCode(200)
  @Post('password/verify')
  async verifyPassword(
    @ReqUser() user: User,
    @Body() verifyUserPasswordDto: VerifyPasswordDto,
  ): Promise<ApiResponse> {
    await this.userService.verifyPassword(user, verifyUserPasswordDto.password);
    return ApiResponse.createSuccessApiResponse('인증처리 되었습니다.');
  }

  @HttpCode(200)
  @Put('password')
  async findPassword(
    @ReqUser() user: User,
    @Body() FindPasswordDto: FindPasswordDto,
  ): Promise<ApiResponse> {
    const updatedUser = await this.userService.findPassword(
      user,
      FindPasswordDto,
    );
    return ApiResponse.createSuccessApiResponse(
      '비밀번호가 변경되었습니다.',
      updatedUser,
    );
  }

  @HttpCode(200)
  @Delete()
  async delete(
    @ReqUser() user: User,
    @Body() deleteUserDto: DeleteUserDto,
  ): Promise<ApiResponse> {
    await this.userService.delete(user, deleteUserDto.exitReason);
    return ApiResponse.createSuccessApiResponse(
      '회원의 계정이 삭제되었습니다.',
    );
  }
}
