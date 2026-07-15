// common/dto/response-general.dto.ts
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from '@nestjs/common';
import { IApiResponse } from '../interfaces/api-response.interface';
import { buildDtoExampleFromModel } from '../swagger/build-dto-example.util';

export class ResponseGeneralDto<T = any> {
    @ApiProperty({
        description: 'Código de respuesta HTTP',
        example: 200,
        minimum: 100,
        maximum: 599,
    })
    codresp: number;

    @ApiProperty({
        description: 'Mensaje descriptivo de la respuesta',
        example: 'Operación exitosa',
    })
    mensaje: string;

    @ApiProperty({
        description: 'Estado booleano de la operación',
        example: true,
    })
    status: boolean;

    @ApiProperty({
        description: 'Datos de la respuesta (estructura variable según el endpoint)',
        oneOf: [
            { type: 'object' },
            { type: 'array' },
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'null' },
        ],
    })
    datos: T;

    /**
     * Esquema Swagger para respuestas envueltas en ResponseGeneralDto.
     *
     * @example
     * ResponseGeneralDto.swaggerSchema(ResponseCreateUserDto, {
     *   codresp: HttpStatus.CREATED,
     *   mensaje: 'Usuario creado exitosamente',
     *   status: true,
     *   // datosExample es opcional: si no se envía, se arma desde @ApiProperty del model
     * })
     */
    static swaggerSchema<TModel extends Type<unknown>>(
        model: TModel,
        options?: {
            isArray?: boolean;
            nullable?: boolean;
            /** Código HTTP mostrado en el ejemplo (ej. HttpStatus.CREATED) */
            codresp?: number;
            /** Mensaje del sobre (debe coincidir con @ResponseMessage si lo usas) */
            mensaje?: string;
            /** Estado de la operación en el ejemplo */
            status?: boolean;
            /**
             * Ejemplo explícito de `datos`. Si se omite, se genera desde
             * los `example` de @ApiProperty del DTO pasado en `model`.
             */
            datosExample?: unknown;
        },
    ): Record<string, unknown> {
        const datosExample =
            options?.datosExample !== undefined
                ? options.datosExample
                : buildDtoExampleFromModel(model);

        const datosExampleForSchema =
            options?.isArray && datosExample !== undefined ? [datosExample] : datosExample;

        const datosSchema: Record<string, unknown> = options?.isArray
            ? { type: 'array', items: { $ref: getSchemaPath(model) } }
            : { $ref: getSchemaPath(model) };

        if (options?.nullable) {
            datosSchema.nullable = true;
        }

        if (datosExampleForSchema !== undefined) {
            datosSchema.example = datosExampleForSchema;
        }

        const schema: Record<string, unknown> = {
            allOf: [
                { $ref: getSchemaPath(ResponseGeneralDto) },
                {
                    properties: {
                        datos: datosSchema,
                    },
                },
            ],
        };

        const envelopeExample: Record<string, unknown> = {};

        if (options?.codresp !== undefined) {
            envelopeExample.codresp = options.codresp;
        }
        if (options?.mensaje !== undefined) {
            envelopeExample.mensaje = options.mensaje;
        }
        if (options?.status !== undefined) {
            envelopeExample.status = options.status;
        }
        if (datosExampleForSchema !== undefined) {
            envelopeExample.datos = datosExampleForSchema;
        }

        if (Object.keys(envelopeExample).length > 0) {
            schema.example = envelopeExample;
        }

        return schema;
    }

    // Métodos helpers para construcción
    static success<T>(datos: T, mensaje: string = 'Operación exitosa'): ResponseGeneralDto<T> {
        return {
            codresp: 200,
            mensaje,
            status: true,
            datos,
        };
    }

    static error(mensaje: string, codresp: number = 400): ResponseGeneralDto<null> {
        return {
            codresp,
            mensaje,
            status: false,
            datos: null,
        };
    }

    static created<T>(datos: T, mensaje: string = 'Recurso creado exitosamente'): ResponseGeneralDto {
        return {
            codresp: 201,
            mensaje,
            status: true,
            datos,
        };
    }

    static generic<T>(codresp: number, mensaje: string, status: boolean, datos: T): IApiResponse<T> {
        return {
            codresp,
            mensaje,
            status,
            datos,
        };
    }
}