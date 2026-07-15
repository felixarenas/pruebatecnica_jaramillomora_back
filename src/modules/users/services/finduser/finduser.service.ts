import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../interfaces/users.interfaces";
import { UserEntity } from "../../entities/user.entity";

@Injectable()
export class FindUserService {
    constructor(private readonly userRepository: UserRepository) { }

    async findById(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    async findByLogin(login: string): Promise<UserEntity> {
        const user = await this.userRepository.findByLogin(login);
        if (!user) {
            throw new NotFoundException(`Usuario ${login} no encontrado`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`Usuario ${email} no encontrado`);
        }
        return user;
    }
}
