import { ConflictException, Injectable } from "@nestjs/common";
import { UserRepository } from "../../interfaces/users.interfaces";
import { CreateUserDto } from "../../controllers/dto/int/createuser.dto";
import { UserEntity } from "../../entities/user.entity";
import { generateHash } from "src/core/config";

@Injectable()
export class CreateUserService {
    constructor(private readonly userRepository: UserRepository) { }

    async create(data: CreateUserDto): Promise<UserEntity> {

        const existingUser = await this.userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictException('El correo electrónico ya está registrado');
        }

        const existingLogin = await this.userRepository.findByLogin(data.username);

        if (existingLogin) {
            throw new ConflictException('El nombre de usuario ya está registrado');
        }

        const existingIdentity = await this.userRepository.findByNumberTypeIdentity(data.id_identity_type, data.identity_number);

        if (existingIdentity) {
            throw new ConflictException('El número de identificación ya está registrado para el tipo de identificación especificado');
        }

        const passwordHash = await generateHash(data.passwd);

        const existingPassword = await this.userRepository.findByPassword(passwordHash);

        if (existingPassword) {
            throw new ConflictException('La contraseña ya está en uso por otro usuario');
        }

        const userData = {
            first_names: data.first_names,
            last_names: data.last_names,
            email: data.email,
            username: data.username,
            passwd: passwordHash,
            phone_number: data.phone_number,
            id_identity_type: data.id_identity_type,
            identity_number: data.identity_number,
        };

        return await this.userRepository.create(userData);
    }
}
