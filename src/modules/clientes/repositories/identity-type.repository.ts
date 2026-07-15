import { Injectable } from '@nestjs/common';
import { identity_type } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { handleError } from 'src/core/config/handleError';
import { IdentityTypeEntity } from '../entities/identity-type.entity';
import { IdentityTypeRepository } from '../interfaces/identity-type.interfaces';

@Injectable()
export class PrismaIdentityTypeRepository implements IdentityTypeRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<IdentityTypeEntity[]> {
        try {
            const models = await this.prisma.identity_type.findMany({
                orderBy: { id: 'asc' },
            });

            return models.map((model) => this.mapToEntity(model));
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(model: identity_type): IdentityTypeEntity {
        return new IdentityTypeEntity(
            model.id,
            model.abr,
            model.name,
            model.dian_code,
            model.description,
        );
    }
}
