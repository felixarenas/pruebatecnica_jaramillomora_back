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
import { DeleteClienteService } from '../../services/deletecliente/deletecliente.service';
import { ResponseClienteDto } from '../dto/out/responsecliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@ApiTags('Clientes')
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class DeleteClienteController {
    constructor(private readonly deleteClienteService: DeleteClienteService) { }

    @Delete()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Eliminar un cliente (borrado lógico)',
        description: 'Inactiva un cliente estableciendo su campo estado en false',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cliente eliminado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Cliente eliminado exitosamente',
            status: true,
        }),
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Cliente no encontrado',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.NOT_FOUND,
            mensaje: 'Cliente no encontrado',
            status: false,
            datosExample: null,
        }),
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'El cliente ya se encuentra inactivo',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.BAD_REQUEST,
            mensaje: 'El cliente ya se encuentra inactivo',
            status: false,
            datosExample: null,
        }),
    })
    async delete(@Query('id', ParseIntPipe) id: number) {
        const entity = await this.deleteClienteService.execute(id);

        return {
            mensaje: 'Cliente eliminado exitosamente',
            datos: ClienteMapper.toResponseDto(entity),
        };
    }
}
