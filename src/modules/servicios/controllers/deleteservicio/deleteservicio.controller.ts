import {
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { ResponseGeneralDto } from 'src/core/dto/responsegeneral.dto';
import { DeleteServicioService } from '../../services/deleteservicio/deleteservicio.service';
import { ResponseServicioDto } from '../dto/out/responseservicio.dto';
import { ServicioMapper } from '../mappers/servicio.mapper';

@ApiTags('Servicios')
@Controller('servicios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class DeleteServicioController {
    constructor(private readonly deleteServicioService: DeleteServicioService) { }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Eliminar un servicio (borrado lógico)',
        description: 'Inactiva un servicio estableciendo su campo estado en false',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Servicio eliminado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Servicio eliminado exitosamente',
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
        status: HttpStatus.BAD_REQUEST,
        description: 'El servicio ya se encuentra inactivo',
        schema: ResponseGeneralDto.swaggerSchema(ResponseServicioDto, {
            codresp: HttpStatus.BAD_REQUEST,
            mensaje: 'El servicio ya se encuentra inactivo',
            status: false,
            datosExample: null,
        }),
    })
    async delete(@Query('id', ParseIntPipe) id: number) {
        const entity = await this.deleteServicioService.execute(id);

        return {
            mensaje: 'Servicio eliminado exitosamente',
            datos: ServicioMapper.toResponseDto(entity),
        };
    }
}
