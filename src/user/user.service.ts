import { DatabaseService } from '../common/database/database.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '../common/interface/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(username: string, password: string, name: string): Promise<IUser> {
    const user = await this.databaseService.user.create({
      data: {
        username,
        password,
        name,
      },
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  async findByUsername(username: string): Promise<IUser | undefined> {
    return this.databaseService.user.findFirst({
      where: {
        username,
      },
    });
  }

  async findById(id: number): Promise<IUser | undefined> {
    return this.databaseService.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findOne(id: number): Promise<IUser | undefined> {
    const user = await this.databaseService.user.findFirst({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll(): Promise<IUser[]> {
    return this.databaseService.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.databaseService.user.update({
      data: updateUserDto,
      where: { id },
      select: { id: true, username: true, name: true },
    });
  }

  async remove(id: number): Promise<string> {
    const deletedUser = await this.databaseService.user.deleteMany({
      where: { id },
    });

    if (deletedUser.count === 0) {
      throw new NotFoundException('User not found');
    }

    return 'User deleted successfully';
  }
}
