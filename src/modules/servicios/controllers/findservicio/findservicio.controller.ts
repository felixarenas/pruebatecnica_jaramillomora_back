import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { FindServicioService } from '../../services/findservicio/findservicio.service';
import { ResponseServicioDto } from '../dto/out/responseservicio.dto';
import { ResponseServicioListDto } from '../dto/out/responseservicio-list.dto';
import { ServicioMapper } from '../mappers/servicio.mapper';

@ApiTags('Servicios')
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ResponseGeneralDto, ResponseServicioDto, ResponseServicioListDto)
@UseGuards(JwtAuthGuard)
export class FindServicioController {
    constructor(private readonly findServicioService: FindServicioService) { }

    @Get('getall')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar todos los servicios',
        description: 'Permite consultar todos los registros de servicios del sistema',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicios consultados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioListDto, {
            isArray: true,
            codresp: HttpStatus.OK,
            mensaje: 'Servicios consultados exitosamente',
            status: true,
        }),
    })
    async getAllServicios() {
        const entities = await this.findServicioService.getAllServicios();

        return {
            mensaje: 'Servicios consultados exitosamente',
            datos: ServicioMapper.toListResponseDtoList(entities),
        };
    }

    @Get('findbyid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar un servicio por su id',
        description: 'Permite consultar un servicio del sistema por su identificador',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicio encontrado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Servicio encontrado exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Servicio no encontrado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'Servicio no encontrado',
            status: false,
            datosExample: null,
        }),
    })
    async getServicioById(@Query('id', ParseIntPipe) id: number) {
        const entity = await this.findServicioService.getServicioById(id);

        return {
            mensaje: 'Servicio encontrado exitosamente',
            datos: ServicioMapper.toResponseDto(entity),
        };
    }

    @Get('findbyidcliente')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar servicios por id de cliente',
        description: 'Permite consultar los servicios asociados a un cliente por su identificador',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicios encontrados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            isArray: true,
            codresp: HttpStatus.OK,
            mensaje: 'Servicios encontrados exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Servicios no encontrados',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'No se encontraron servicios para el cliente',
            status: false,
            datosExample: null,
        }),
    })
    async getServicioByIdCliente(@Query('id_cliente', ParseIntPipe) id_cliente: number) {
        const entities = await this.findServicioService.getServicioByIdCliente(id_cliente);

        return {
            mensaje: 'Servicios encontrados exitosamente',
            datos: ServicioMapper.toResponseDtoList(entities),
        };
    }
}
