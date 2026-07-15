import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../../controllers/dto/int/updateuser.dto';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserData, UserRepository } from '../../interfaces/users.interfaces';

@Injectable()
export class UpdateUserService {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(dto: UpdateUserDto): Promise<UserEntity> {
        const { id, ...fields } = dto;

        if (!this.hasFieldsToUpdate(fields)) {
            throw new BadRequestException(
                'Debe proporcionar al menos un campo para actualizar',
            );
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        await this.validateUniqueness(id, user, fields);

        const updateData: UpdateUserData = {};

        if (fields.email !== undefined) updateData.email = fields.email;
        if (fields.first_names !== undefined) updateData.first_names = fields.first_names;
        if (fields.last_names !== undefined) updateData.last_names = fields.last_names;
        if (fields.phone_number !== undefined) updateData.phone_number = fields.phone_number;
        if (fields.id_identity_type !== undefined) {
            updateData.id_identity_type = fields.id_identity_type;
        }
        if (fields.identity_number !== undefined) {
            updateData.identity_number = fields.identity_number;
        }
        if (fields.username !== undefined) updateData.username = fields.username;
        if (fields.id_role !== undefined) updateData.id_role = fields.id_role;

        return this.userRepository.update(id, updateData);
    }

    private hasFieldsToUpdate(
        fields: Omit<UpdateUserDto, 'id'>,
    ): boolean {
        return Object.values(fields).some((value) => value !== undefined);
    }

    private async validateUniqueness(
        id: number,
        user: UserEntity,
        fields: Omit<UpdateUserDto, 'id'>,
    ): Promise<void> {
        if (fields.email !== undefined && fields.email !== user.email) {
            const existing = await this.userRepository.findByEmail(fields.email);

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    'El correo electrónico ya está registrado',
                );
            }
        }

        if (fields.username !== undefined && fields.username !== user.username) {
            const existing = await this.userRepository.findByLogin(fields.username);

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    'El nombre de usuario ya está registrado',
                );
            }
        }

        const idIdentityType =
            fields.id_identity_type ?? user.id_identity_type;
        const identityNumber =
            fields.identity_number ?? user.identity_number;

        if (
            fields.id_identity_type !== undefined ||
            fields.identity_number !== undefined
        ) {
            const existing = await this.userRepository.findByNumberTypeIdentity(
                idIdentityType,
                identityNumber,
            );

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    'El número de identificación ya está registrado para el tipo de identificación especificado',
                );
            }
        }
    }
}
