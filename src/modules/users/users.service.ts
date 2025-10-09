import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelpers } from '@/helpers/utils';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}


  isEmailExist = async(email: string) =>{
    const user = await this.userModel.exists({email})
    if(user) return true
    return false
  }

  async create(createUserDto: CreateUserDto) {
    const {name, email, password, phone, address, image} = createUserDto

    
    const emailExist = await this.isEmailExist(email)
    if(emailExist){
      throw new BadRequestException(`Email ${email} đã tồn tại`)
    }
    const hashedPassword = await hashPasswordHelpers(password)
     const newUser = await this.userModel.create({
     name , email, phone, address, image,
     password: hashedPassword,
    })

    // Lưu vào MongoDB
    // const savedUser = await newUser.save();
    return {
      _id: newUser._id
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);
    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize
    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (current - 1) *(pageSize)

    const results = await this.userModel
    .find(filter)
    .skip(skip)
    .limit(pageSize)
    .select("-password")
    .sort(sort as any)

    return {results, totalPages}
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}


