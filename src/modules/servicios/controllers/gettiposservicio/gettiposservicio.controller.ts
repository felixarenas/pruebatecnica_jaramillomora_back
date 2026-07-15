import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiExtraModels,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { GetTiposServicioService } from '../../services/gettiposservicio/gettiposservicio.service';
import { ResponseTipoServicioDto } from '../dto/out/responsetiposervicio.dto';
import { TipoServicioMapper } from '../mappers/tipo-servicio.mapper';

@ApiTags('Servicios')
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ResponseGeneralDto, ResponseTipoServicioDto)
@UseGuards(JwtAuthGuard)
export class GetTiposServicioController {
    constructor(private readonly getTiposServicioService: GetTiposServicioService) { }

    @Get('gettiposservicio')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar todos los tipos de servicio',
        description: 'Permite consultar todos los registros de la tabla tipo_servicios',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tipos de servicio consultados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseTipoServicioDto, {
            isArray: true,
            codresp: HttpStatus.OK,
            mensaje: 'Tipos de servicio consultados exitosamente',
            status: true,
        }),
    })
    async getTiposServicio() {
        const entities = await this.getTiposServicioService.getAll();

        return {
            mensaje: 'Tipos de servicio consultados exitosamente',
            datos: TipoServicioMapper.toResponseDtoList(entities),
        };
    }
}
