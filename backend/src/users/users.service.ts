import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getScore(queryDto: QueryDto) {
    const user = await this.userModel.findOne(queryDto);

    if (!!user) {
      return { score: user.score };
    } else {
      const newUser = new this.userModel(queryDto);
      await newUser.save();

      return { score: 0 };
    }
  }

  async plusScore(queryDto: QueryDto) {
    const { address } = queryDto;
    const user = await this.userModel.findOne({ address });

    if (!!user) {
      const score = await user.plusScore();
      await user.save();

      return { score: user.score, success: true };
    } else {
      return {
        success: false,
      };
    }
  }

  async minusScore(queryDto: QueryDto) {
    const { address } = queryDto;
    const user = await this.userModel.findOne({ address });
    const score = await user.minusScore();

    if (!!user) {
      const score = await user.minusScore();
      await user.save();

      return { score: user.score, success: true };
    } else {
      return {
        success: false,
      };
    }
  }
}
