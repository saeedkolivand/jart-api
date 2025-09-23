import { 
  Body, 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  Get, 
  HttpStatus, 
  HttpException,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiBody 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Successfully logged in' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Invalid credentials' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error' 
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Login error', error);
      throw new HttpException(
        'Login failed', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return current user' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  @ApiResponse({ 
    status: HttpStatus.INTERNAL_SERVER_ERROR, 
    description: 'Internal server error' 
  })
  async getProfile(@Request() req: { user: JwtPayload }) {
    try {
      // The user information is already attached to the request by the JWT strategy
      return {
        id: req.user.sub,
        email: req.user.email,
        // Add any other user fields you want to expose
      };
    } catch (error) {
      this.logger.error('Error fetching user profile', error);
      throw new HttpException(
        'Failed to fetch user profile', 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
