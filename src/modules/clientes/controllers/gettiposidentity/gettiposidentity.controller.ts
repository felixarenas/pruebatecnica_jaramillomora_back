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
import { GetTiposIdentityService } from '../../services/gettiposidentity/gettiposidentity.service';
import { ResponseIdentityTypeDto } from '../dto/out/responseidentitytype.dto';
import { IdentityTypeMapper } from '../mappers/identity-type.mapper';

@ApiTags('Clientes')
@Controller('clientes')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ResponseGeneralDto, ResponseIdentityTypeDto)
@UseGuards(JwtAuthGuard)
export class GetTiposIdentityController {
    constructor(private readonly getTiposIdentityService: GetTiposIdentityService) { }

    @Get('gettiposidentity')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Consultar todos los tipos de identificación',
        description: 'Permite consultar todos los registros de la tabla identity_type',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Tipos de identificación consultados exitosamente',
        schema: ResponseGeneralDto.swaggerSchema(ResponseIdentityTypeDto, {
            isArray: true,
            codresp: HttpStatus.OK,
            mensaje: 'Tipos de identificación consultados exitosamente',
            status: true,
        }),
    })
    async getTiposIdentity() {
        const entities = await this.getTiposIdentityService.getAll();

        return {
            mensaje: 'Tipos de identificación consultados exitosamente',
            datos: IdentityTypeMapper.toResponseDtoList(entities),
        };
    }
}
