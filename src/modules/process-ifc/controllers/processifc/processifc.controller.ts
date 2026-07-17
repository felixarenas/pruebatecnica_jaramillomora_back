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
import { PropertySetsIfcDto } from '../dto/int/propertySets-ifc.dto';

@ApiTags('Process IFC')
@ApiExtraModels(ResponseGeneralDto, ResponseProcessIfcDto, ResponseFileIfcDto)
@Controller('process-ifc')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ProcessIfcController {
  constructor(
    private readonly processIfcService: ProcessIfcService,
    private readonly getFileIfcAllService: GetFileIfcAllService,
  ) { }

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

  @Post('process-property-sets-ifc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Procesar Property Sets y generar graficos',
    description:
      'Recibe nombre de archivo y genera json son datos para graficar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'datos para graficar obtenidos exitosamente',
    schema: ResponseGeneralDto.swaggerSchema(ResponseProcessIfcDto, {
      codresp: HttpStatus.OK,
      mensaje: 'datos para graficar obtenidos exitosamente',
      status: true,
      datosExample: {
        "codresp": 200,
        "mensaje": "Property Sets procesados y archivo IFC almacenado exitosamente",
        "status": true,
        "datos": {
          "status": true,
          "message": "IFC procesado correctamente",
          "data": {
            "modelID": 0,
            "categorias": [
              {
                "categoria": "IfcMember",
                "cantidad": 3348
              },
              {
                "categoria": "IfcPlate",
                "cantidad": 1349
              }
            ],
            "elementosPorNivel": [
              {
                "nivel": "01 - Entry Level",
                "elementos": [
                  {
                    "nom_elemento": "IfcMember",
                    "cantidad": 2896
                  },
                  {
                    "nom_elemento": "IfcPlate",
                    "cantidad": 1207
                  }
                ]
              },
              {
                "nivel": "02 - Floor",
                "elementos": [
                  {
                    "nom_elemento": "IfcMember",
                    "cantidad": 263
                  },
                  {
                    "nom_elemento": "IfcPlate",
                    "cantidad": 76
                  },
                  {
                    "nom_elemento": "IfcColumn",
                    "cantidad": 54
                  }
                ]
              }
            ],
            "materiales": [
              {
                "material": "Metal - Aluminium, Black-Anodized",
                "cantidad": 3629,
                "precio": 0
              },
              {
                "material": "Glass",
                "cantidad": 1398,
                "precio": 0
              },
              {
                "material": "Concrete - Cast-in-Place Concrete",
                "cantidad": 257,
                "precio": 0
              },
              {
                "material": "Stone - Granite",
                "cantidad": 168,
                "precio": 0
              },
              {
                "material": "Plasterboard",
                "cantidad": 134,
                "precio": 0
              }
            ]
          }
        }
      },
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
  async processPropertySets(@Body() dto: PropertySetsIfcDto) {

    const datos = await this.processIfcService.processPropertySetsIfcFile(dto);

    return {
      mensaje: 'Property Sets procesados y archivo IFC almacenado exitosamente',
      datos,
    };
  }

  @Get('resetcache')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset cache',
    description:
      'Resetea todas las caches del aplicativo',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cache reseteada exitosamente',
    schema: ResponseGeneralDto.swaggerSchema(ResponseFileIfcDto, {
      codresp: HttpStatus.OK,
      mensaje: 'Cache reseteada exitosamente',
      status: true,
      datosExample: null,
    }),
  })
  async resetCache() {
    const datos = await this.processIfcService.resetCache();

    return {
      mensaje: 'Cache reseteada exitosamente',
      datos,
    };
  }
}
