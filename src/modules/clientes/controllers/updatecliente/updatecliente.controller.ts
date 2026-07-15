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
import { UpdateClienteService } from '../../services/updatecliente/updatecliente.service';
import { UpdateClienteDto } from '../dto/int/updatecliente.dto';
import { ResponseClienteDto } from '../dto/out/responsecliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@ApiTags('Clientes')
@ApiExtraModels(ResponseGeneralDto, ResponseClienteDto)
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UpdateClienteController {
    constructor(private readonly updateClienteService: UpdateClienteService) { }

    @Patch('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Actualizar información de un cliente',
        description:
            'Permite actualizar nombres, apellidos, fecha de nacimiento, número de celular y correo de un cliente existente',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cliente actualizado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Cliente actualizado exitosamente',
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
        status: HttpStatus.CONFLICT,
        description: 'Datos duplicados',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.CONFLICT,
            mensaje: 'El correo electrónico ya está registrado',
            status: false,
            datosExample: null,
        }),
    })
    async update(@Body() dto: UpdateClienteDto) {
        const entity = await this.updateClienteService.execute(dto);

        return {
            mensaje: 'Cliente actualizado exitosamente',
            datos: ClienteMapper.toResponseDto(entity),
        };
    }
}
