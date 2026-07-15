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
import { FindClienteService } from '../../services/findcliente/findcliente.service';
import { ResponseClienteDto } from '../dto/out/responsecliente.dto';
import { ClienteMapper } from '../mappers/cliente.mapper';

@ApiTags('Clientes')
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ResponseGeneralDto, ResponseClienteDto)
@UseGuards(JwtAuthGuard)
export class FindClienteController {
    constructor(private readonly findClienteService: FindClienteService) { }

    @Get('getall')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar todos los clientes',
        description: 'Permite consultar todos los registros de clientes del sistema',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Clientes consultados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            isArray: true,
            codresp: HttpStatus.OK,
            mensaje: 'Clientes consultados exitosamente',
            status: true,
        }),
    })
    async getClienteAll() {
        const entities = await this.findClienteService.getClienteAll();

        return {
            mensaje: 'Clientes consultados exitosamente',
            datos: ClienteMapper.toResponseDtoList(entities),
        };
    }

    @Get('findbyid')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar un cliente por su id',
        description: 'Permite consultar un cliente del sistema por su identificador',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cliente encontrado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Cliente encontrado exitosamente',
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
    async findById(@Query('id', ParseIntPipe) id: number) {
        const entity = await this.findClienteService.getClienteById(id);

        return {
            mensaje: 'Cliente encontrado exitosamente',
            datos: ClienteMapper.toResponseDto(entity),
        };
    }

    @Get('findbyidentity')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar un cliente por su identificación',
        description: 'Permite consultar un cliente del sistema por su número de identificación',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Cliente encontrado exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseClienteDto, {
            codresp: HttpStatus.OK,
            mensaje: 'Cliente encontrado exitosamente',
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
    async findByIdentity(@Query('identificacion', ParseIntPipe) identificacion: number) {
        const entity = await this.findClienteService.getClienteByIdentity(identificacion);

        return {
            mensaje: 'Cliente encontrado exitosamente',
            datos: ClienteMapper.toResponseDto(entity),
        };
    }
}
