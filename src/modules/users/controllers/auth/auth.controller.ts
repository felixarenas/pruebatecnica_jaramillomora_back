import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../dto/int/login.dto';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { ResponseLoginDto } from '../dto/out/responselogin.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('users/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con login y passwd' })
  @ApiExtraModels(ResponseGeneralDto, ResponseLoginDto)
  @ApiOkResponse({
    description: 'Autenticación exitosa, devuelve JWT',
    schema: ResponseGeneralDto.swaggerSchema(ResponseLoginDto, {
      codresp: HttpStatus.OK,
      mensaje: 'Autenticación exitosa',
      status: true,
    }),
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o usuario inactivo' })
  async login(@Body() loginDto: LoginDto): Promise<ResponseLoginDto> {

    const response = await this.authService.login(loginDto);

    return response;
  }
 
}
