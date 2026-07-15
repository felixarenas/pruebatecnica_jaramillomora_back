import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../../interfaces/users.interfaces";
import { UserEntity } from "../../entities/user.entity";

@Injectable()
export class ActiveInactiveUserService {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(id: number, active: boolean): Promise<UserEntity> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        return this.userRepository.updateActive(id, active);
    }
}
