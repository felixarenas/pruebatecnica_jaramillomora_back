import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { IApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // Determinamos el código HTTP
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        if (!(exception instanceof HttpException)) {
            this.logger.error(
                exception instanceof Error ? exception.stack ?? exception.message : String(exception),
            );
        }

        // Extraemos el mensaje de la excepción de NestJS
        let message = 'Error interno del servidor';
        if (exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            // NestJS agrupa los errores de validación (class-validator) en un array
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || exception.message;
            } else {
                message = exception.message;
            }
        }

        // Construimos la respuesta estandarizada
        const errorResponse: IApiResponse<null> = {
            codresp: status,
            mensaje: Array.isArray(message) ? message[0] : message, // Tomamos el primer error si es un array de validaciones
            status: false,
            datos: null,
        };

        response.status(status).json(errorResponse);
    }
}