import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';

/**
 * Mensaje personalizado que el ResponseInterceptor usará en `mensaje`.
 * Si no se define, se usa getDefaultMessage(statusCode).
 */
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message);
