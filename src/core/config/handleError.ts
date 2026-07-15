import { Prisma } from "@prisma/client";
import { BadRequestException, ConflictException, InternalServerErrorException } from "@nestjs/common";

export const handleError = (error: any): never => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Capturamos errores conocidos de Prisma (como violaciones de restricciones únicas)
        if (error.code === 'P2002') {
            throw new ConflictException(`Conflicto de datos: El registro ya existe. Detalle: ${error.meta?.modelName || 'Modelo'} unique constraint failed.`);
        }
        // Para otros errores conocidos, devolvemos el mensaje de Prisma
        throw new BadRequestException(`Error en la base de datos [${error.code}]: ${error.message}`);
    }
    // Error genérico con el mensaje original del error
    throw new InternalServerErrorException(`Error de servidor: ${error.message || 'Sin descripción'}`);
}