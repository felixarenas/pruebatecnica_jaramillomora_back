import { Body, Controller, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { UpdateUserDto } from '../dto/int/updateuser.dto';
import { ResponseCreateUserDto } from '../dto/out/responsecreateuser.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UpdateUserService } from '../../services/updateuser/updateuser.service';

@ApiTags('Usuarios')
@ApiExtraModels(ResponseGeneralDto, ResponseCreateUserDto)
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UpdateUsersController {
    constructor(private readonly updateUserService: UpdateUserService) { }

    @Patch('update_users')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar información básica de un usuario',
        description:
            'Permite actualizar email, nombres, teléfono, identificación, username e id_role de un usuario existente',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuario actualizado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Usuario actualizado exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Usuario no encontrado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'Usuario no encontrado',
            status: false,
            datosExample: null,
        }),
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Datos duplicados',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'El correo electrónico ya está registrado',
            status: false,
            datosExample: null,
        }),
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.BAD_REQUEST,
            mensaje: 'Datos de entrada inválidos',
            status: false,
            datosExample: null,
        }),
    })
    async update(@Body() dto: UpdateUserDto) {
        const entity = await this.updateUserService.execute(dto);

        return {
            mensaje: 'Usuario actualizado exitosamente',
            datos: UserMapper.toResponseDto(entity),
        };
    }
}
