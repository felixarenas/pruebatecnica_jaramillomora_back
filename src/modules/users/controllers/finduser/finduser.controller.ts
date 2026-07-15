import { Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Query, UseGuards, ValidationPipe } from "@nestjs/common";
import { FindUserService } from "../../services/finduser/finduser.service";
import { ResponseCreateUserDto } from "../dto/out/responsecreateuser.dto";
import { ResponseUserByStoreDto } from "../dto/out/responseuserbystore.dto";
import { UserMapper } from "../mappers/user.mapper";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/core/guards/jwt-auth.guard";
import { ResponseGeneralDto } from "src/core/dto/responsegeneral.dto";

@ApiTags('Usuarios')
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class FindUserController {
    constructor(private readonly findUserService: FindUserService) { }

    @Get('findbyid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Encontrar un usuario del sistema por su id',
        description: 'Permite encontrar un usuario del sistema por su id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuario encontrado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Usuario encontrado exitosamente',
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
    async findById(@Query('id', ParseIntPipe) id: number): Promise<ResponseCreateUserDto> {
        const entity = await this.findUserService.findById(id);
        return UserMapper.toResponseDto(entity);
    }

    @Get('findbyemail')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Encontrar un usuario del sistema por su correo',
        description: 'Permite encontrar un usuario del sistema por su correo',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Usuario encontrado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Usuario encontrado exitosamente',
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
    async findByEmail(@Query('email') email: string): Promise<ResponseCreateUserDto> {
        const entity = await this.findUserService.findByEmail(email);
        return UserMapper.toResponseDto(entity);
    }
}
