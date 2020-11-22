import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword, hashPassword } from '../util/crypto';
import { CustomException } from '../util/http';
import { ChangeInfoDto } from './dto/change-info.dto';
import { FindPasswordDto } from './dto/find-password.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('users') private readonly userModel: Model<User>) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findByEmail(email: string | RegExp): Promise<User> {
    return await this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (user) {
      return true;
    }
    return false;
  }

  async save(userDto: any): Promise<User> {
    const user = new this.userModel(userDto);
    return user.save();
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
