import { IdentityTypeEntity } from '../entities/identity-type.entity';

export abstract class IdentityTypeRepository {
    abstract findAll(): Promise<IdentityTypeEntity[]>;
}
