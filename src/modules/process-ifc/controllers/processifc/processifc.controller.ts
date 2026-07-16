import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
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
import { GetFileIfcAllService } from '../../services/getfileifcall/getfileifcall.service';
import { ProcessIfcService } from '../../services/processifc/processifc.service';
import { ProcessIfcDto } from '../dto/int/process-ifc.dto';
import { ResponseFileIfcDto } from '../dto/out/response-file-ifc.dto';
import { ResponseProcessIfcDto } from '../dto/out/response-process-ifc.dto';

@ApiTags('Process IFC')
@ApiExtraModels(ResponseGeneralDto, ResponseProcessIfcDto, ResponseFileIfcDto)
@Controller('process-ifc')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ProcessIfcController {
  constructor(
    private readonly processIfcService: ProcessIfcService,
    private readonly getFileIfcAllService: GetFileIfcAllService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Procesar y almacenar archivo IFC',
    description:
      'Recibe un archivo en base64, lo transforma a su formato original según la extensión ' +
      'y lo almacena en el storage de la aplicación (nom_file.ext).',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Archivo procesado y almacenado exitosamente',
    schema: ResponseGeneralDto.swaggerSchema(ResponseProcessIfcDto, {
      codresp: HttpStatus.CREATED,
      mensaje: 'Archivo IFC procesado y almacenado exitosamente',
      status: true,
    }),
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payload inválido o base64 incorrecto',
    schema: ResponseGeneralDto.swaggerSchema(ResponseProcessIfcDto, {
      codresp: HttpStatus.BAD_REQUEST,
      mensaje: 'El campo base64 es requerido',
      status: false,
      datosExample: null,
    }),
  })
  async process(@Body() dto: ProcessIfcDto) {
    const datos = await this.processIfcService.process(dto);

    return {
      mensaje: 'Archivo IFC procesado y almacenado exitosamente',
      datos,
    };
  }

  @Get('getFileIfcAll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar archivos IFC cargados',
    description:
      'Entrega todos los registros de ref_files con el nombre del archivo y una URL HTTP ' +
      'pública (storage) usable en navegador o librerías de renderizado 3D.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Archivos IFC consultados exitosamente',
    schema: ResponseGeneralDto.swaggerSchema(ResponseFileIfcDto, {
      isArray: true,
      codresp: HttpStatus.OK,
      mensaje: 'Archivos IFC consultados exitosamente',
      status: true,
    }),
  })
  async getFileIfcAll() {
    const datos = await this.getFileIfcAllService.getFileIfcAll();

    return {
      mensaje: 'Archivos IFC consultados exitosamente',
      datos,
    };
  }
}
