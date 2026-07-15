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
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { GetServiciosByClienteService } from '../../services/getserviciosbycliente/getserviciosbycliente.service';
import { ResponseServiciosByClienteDto } from '../dto/out/responseserviciosbycliente.dto';
import { ServiciosByClienteMapper } from '../mappers/servicios-by-cliente.mapper';

@ApiTags('Servicios')
@ApiExtraModels(ResponseGeneralDto, ResponseServiciosByClienteDto)
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class GetServiciosByClienteController {
    constructor(
        private readonly getServiciosByClienteService: GetServiciosByClienteService,
    ) { }

    @Get('getServiciosByCliente')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar servicios por identificación del cliente',
        description:
            'Permite consultar los servicios asociados a un cliente mediante su tipo y número de identificación',
    })
    @ApiQuery({
        name: 'id_tipo_identificacion',
        type: Number,
        description: 'Identificador del tipo de identificación del cliente',
        example: 1,
    })
    @ApiQuery({
        name: 'identificacion',
        type: Number,
        description: 'Número de identificación del cliente',
        example: 1234567890,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicios del cliente consultados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServiciosByClienteDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Servicios del cliente consultados exitosamente',
            status: true,
            datosExample: {
                "id_cliente": 1,
                "nom_cliente": "Juan Pérez",
                "tipo_identificacion": "Cédula de ciudadanía",
                "numero_identificacion": 1234567890,
                "servicios": [
                    {
                    "id_servicio": 1,
                    "nom_servicio": "Internet residencial",
                    "fecha_inicio": "2024-01-15",
                    "ultima_facturacion": "2024-06-01",
                    "ultimo_pago": 50000,
                    "estado_servicio": true
                    }
                ]
            }
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Cliente o servicios no encontrados',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServiciosByClienteDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'Cliente no encontrado con el tipo y número de identificación proporcionados',
            status: false,
            datosExample: null,
        }),
    })
    async getServiciosByCliente(
        @Query('id_tipo_identificacion', ParseIntPipe) id_tipo_identificacion: number,
        @Query('identificacion', ParseIntPipe) identificacion: number,
    ) {
        const entity = await this.getServiciosByClienteService.getServiciosByCliente(
            id_tipo_identificacion,
            identificacion,
        );

        return {
            mensaje: 'Servicios del cliente consultados exitosamente',
            datos: ServiciosByClienteMapper.toResponseDto(entity),
        };
    }
}
