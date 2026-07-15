import { Injectable } from '@nestjs/common';
import { IdentityTypeEntity } from '../../entities/identity-type.entity';
import { IdentityTypeRepository } from '../../interfaces/identity-type.interfaces';

@Injectable()
export class GetTiposIdentityService {
    constructor(private readonly identityTypeRepository: IdentityTypeRepository) { }

    async getAll(): Promise<IdentityTypeEntity[]> {
        return this.identityTypeRepository.findAll();
    }
}
