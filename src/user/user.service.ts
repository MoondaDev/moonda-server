import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { comparePassword, hashPassword } from '../util/crypto';
import { CustomException } from '../util/http';
import { ChangeInfoDto } from './dto/change-info.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findByEmail(email: string | RegExp): Promise<User> {
    return await this.userModel.findByEmail(email);
  }

  async getByEmail(email: string | RegExp): Promise<User> {
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new HttpException(
        new CustomException('등록되지 않은 이메일입니다.'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.userModel.existsByEmail(email);
  }

  async create(user: any): Promise<User> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async save(user: User): Promise<User> {
    const savedUser = new this.userModel(user);
    return await savedUser.save();
  }

  async changeInfo(user: User, changeInfoDto: ChangeInfoDto): Promise<User> {
    user.name = changeInfoDto.name;
    user.phone = changeInfoDto.phone;
    return await this.save(user);
  }

  async verifyPassword(user: User, changingPassword: string): Promise<void> {
    const isSamePassword = await comparePassword(
      changingPassword,
      user.password,
    );
    if (!isSamePassword) {
      throw new HttpException(
        new CustomException('Your password is incorrect.'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findPassword(
    user: User,
    findPasswordDto: FindPasswordDto,
  ): Promise<User> {
    const isSamePassword = await comparePassword(
      findPasswordDto.password,
      user.password,
    );

    if (isSamePassword) {
      throw new HttpException(
        new CustomException('Same as the old password.'),
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.changePassword(user, findPasswordDto.password);
  }

  async changePassword(user: User, password: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    return await this.save(user);
  }

  async delete(user: User, exitReason: string): Promise<User> {
    user.exitReason = exitReason;
    user.isExit = true;
    return await this.save(user);
  }
}
