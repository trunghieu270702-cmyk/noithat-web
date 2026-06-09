import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không chính xác',
      );
    }
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username },
    };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userService.findByUsername('admin'); // Only 1 admin
    if (!user || !(await bcrypt.compare(dto.oldPassword, user.password))) {
      throw new UnauthorizedException('Mật khẩu cũ không chính xác');
    }
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userService.updatePassword(user.id, newPasswordHash);
    return { message: 'Đổi mật khẩu thành công' };
  }
}
