import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards, BadRequestException } from "@nestjs/common";
import { CreateUserService } from "../../services/createuser/createuser.service";
import { ActiveInactiveUserService } from "../../services/activeinactiveuser/activeinactiveuser.service";
import { ActiveInactiveUserDto } from "../dto/int/activeinactiveuser.dto";
import { CreateUserDto } from "../dto/int/createuser.dto";
import { ResponseCreateUserDto } from "../dto/out/responsecreateuser.dto";
import { UserMapper } from "../mappers/user.mapper";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { ResponseMessage } from "src/core/decorators/response-message.decorator";
import { ResponseGeneralDto } from "src/core/dto/responsegeneral.dto";

@ApiTags('Usuarios')
@ApiExtraModels(ResponseGeneralDto, ResponseCreateUserDto)
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class CreateUserController {
    constructor(
        private readonly createUserService: CreateUserService,
        private readonly activeInactiveUserService: ActiveInactiveUserService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ResponseMessage('Usuario creado exitosamente')
    @ApiOperation({
        summary: 'Crear un nuevo usuario',
        description: 'Permite crear un nuevo usuario en el sistema',
    })

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Usuario creado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.CREATED,
            mensaje: 'Usuario creado exitosamente',
            status: true,
        }),
    })

    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'El usuario ya existe',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'El usuario ya existe',
            status: false,
            datosExample: null,
        }),
    })
    async create(@Body() dto: CreateUserDto) {
        const entity = await this.createUserService.create(dto);

        /*if (dto.roles?.length) {
            if (!dto.id_store) {
                throw new BadRequestException(
                    'El campo id_store es requerido cuando se asignan roles al usuario',
                );
            }
            await this.createUserRolesService.execute(entity.id, dto.id_store, dto.roles);
        }*/

        return {
            mensaje: 'Usuario creado exitosamente',
            datos: UserMapper.toResponseDto(entity),
        };
    }

    @Patch('activeinactiveuser')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Activar o inactivar un usuario',
        description: 'Permite modificar el estado activo de un usuario en el sistema',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Estado del usuario actualizado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Estado del usuario actualizado exitosamente',
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
        status: HttpStatus.BAD_REQUEST,
        description: 'Datos de entrada inválidos',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.BAD_REQUEST,
            mensaje: 'Datos de entrada inválidos',
            status: false,
            datosExample: null,
        }),
    })
    async activeInactiveUser(@Body() dto: ActiveInactiveUserDto) {
        const entity = await this.activeInactiveUserService.execute(dto.id, dto.active);

        return {
            mensaje: 'Estado del usuario actualizado exitosamente',
            datos: UserMapper.toResponseDto(entity),
        };
    }
}
