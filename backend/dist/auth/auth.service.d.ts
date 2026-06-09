import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(username: string, pass: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            username: any;
        };
    }>;
    changePassword(userId: number, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
