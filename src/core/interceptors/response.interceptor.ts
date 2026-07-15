import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { IApiResponse } from '../interfaces/api-response.interface';
import { ApiResponsePayload } from '../interfaces/api-response-payload.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        const customMessage = this.reflector.getAllAndOverride<string | undefined>(
            RESPONSE_MESSAGE_KEY,
            [context.getHandler(), context.getClass()],
        );

        return next.handle().pipe(
            map((data: T): IApiResponse<T> => {
                const { datos, mensaje } = this.extractPayload(data);

                return {
                    codresp: statusCode,
                    mensaje: mensaje ?? customMessage ?? this.getDefaultMessage(statusCode),
                    status: true,
                    datos: datos === undefined ? null : datos,
                };
            }),
        );
    }

    private extractPayload(data: T): { datos: T | null; mensaje?: string } {
        if (this.isControllerPayload(data)) {
            return {
                datos: (data.datos ?? null) as T | null,
                mensaje: data.mensaje,
            };
        }

        return { datos: data === undefined ? null : data };
    }

    private isControllerPayload(data: T): data is T & ApiResponsePayload<unknown> {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        const record = data as Record<string, unknown>;

        return (
            typeof record.mensaje === 'string' &&
            'datos' in record &&
            typeof record.codresp === 'undefined' &&
            typeof record.status === 'undefined'
        );
    }

    // Un pequeño helper para estandarizar mensajes de éxito si no se provee uno
    private getDefaultMessage(statusCode: number): string {
        const messages = {
            200: 'Operación exitosa',
            201: 'Recurso creado exitosamente',
            204: 'Sin contenido',
            400: 'Solicitud incorrecta',
            401: 'No autorizado',
            403: 'Prohibido',
            404: 'Recurso no encontrado',
            500: 'Error interno del servidor',
        };
        return messages[statusCode] || 'Respuesta procesada';
    }
}