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
import { UpdateServicioService } from '../../services/updateservicio/updateservicio.service';
import { UpdateServicioDto } from '../dto/int/updateservicio.dto';
import { ResponseServicioDto } from '../dto/out/responseservicio.dto';
import { ServicioMapper } from '../mappers/servicio.mapper';

@ApiTags('Servicios')
@ApiExtraModels(ResponseGeneralDto, ResponseServicioDto)
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UpdateServicioController {
    constructor(private readonly updateServicioService: UpdateServicioService) { }

    @Patch('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar información de un servicio',
        description:
            'Permite actualizar el tipo de servicio y la fecha de inicio de un servicio existente',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicio actualizado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Servicio actualizado exitosamente',
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
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Tipo de servicio duplicado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'El cliente ya tiene un servicio activo del mismo tipo',
            status: false,
            datosExample: null,
        }),
    })
    async update(@Body() dto: UpdateServicioDto) {
        const entity = await this.updateServicioService.execute(dto);

        return {
            mensaje: 'Servicio actualizado exitosamente',
            datos: ServicioMapper.toResponseDto(entity),
        };
    }
}
