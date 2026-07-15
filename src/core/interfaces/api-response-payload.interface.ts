/**
 * Forma opcional de devolver datos + mensaje desde un controlador.
 * El interceptor extrae `mensaje` y deja solo `datos` en la respuesta final.
 */
export interface ApiResponsePayload<T> {
    mensaje: string;
    datos: T;
}
