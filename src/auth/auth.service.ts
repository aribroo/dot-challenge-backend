import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHelper } from '../common/helper/hash-password.helper';
import { IUser } from '../common/interface/user.interface';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IUser> {
    const existingUser = await this.userService.findByUsername(registerDto.username);

    if (existingUser) {
      throw new BadRequestException('Username already exist');
    }

    const hashedPassword = await PasswordHelper.hashPassword(registerDto.password);

    return this.userService.create(
      registerDto.username,
      hashedPassword,
      registerDto.name,
    );
  }

  async login(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByUsername(username);

    if (!user || !(await PasswordHelper.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Username or password wrong');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
