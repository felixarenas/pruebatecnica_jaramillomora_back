import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { CreateServicioService } from '../../services/createservicio/createservicio.service';
import { CreateServicioDto } from '../dto/int/createservicio.dto';
import { ResponseServicioDto } from '../dto/out/responseservicio.dto';
import { ServicioMapper } from '../mappers/servicio.mapper';

@ApiTags('Servicios')
@ApiExtraModels(ResponseGeneralDto, ResponseServicioDto)
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class CreateServicioController {
    constructor(private readonly createServicioService: CreateServicioService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo servicio',
        description: 'Permite registrar un nuevo servicio en el sistema',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Servicio creado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.CREATED,
            mensaje: 'Servicio creado exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Cliente no encontrado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'Cliente no encontrado',
            status: false,
            datosExample: null,
        }),
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Servicio duplicado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'El cliente ya tiene un servicio activo del mismo tipo',
            status: false,
            datosExample: null,
        }),
    })
    async create(@Body() dto: CreateServicioDto) {
        const entity = await this.createServicioService.create(dto);

        return {
            mensaje: 'Servicio creado exitosamente',
            datos: ServicioMapper.toResponseDto(entity),
        };
    }
}
