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
import { CreateClienteService } from '../../services/createcliente/createcliente.service';
import { CreateClienteDto } from '../dto/int/createcliente.dto';
import { ResponseClienteDto } from '../dto/out/responsecliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@ApiTags('Clientes')
@ApiExtraModels(ResponseGeneralDto, ResponseClienteDto)
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class CreateClienteController {
    constructor(private readonly createClienteService: CreateClienteService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Crear un nuevo cliente',
        description: 'Permite registrar un nuevo cliente en el sistema',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Cliente creado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.CREATED,
            mensaje: 'Cliente creado exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Datos duplicados',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'La identificación ya está registrada',
            status: false,
            datosExample: null,
        }),
    })
    async create(@Body() dto: CreateClienteDto) {
        const entity = await this.createClienteService.create(dto);

        return {
            mensaje: 'Cliente creado exitosamente',
            datos: ClienteMapper.toResponseDto(entity),
        };
    }
}
