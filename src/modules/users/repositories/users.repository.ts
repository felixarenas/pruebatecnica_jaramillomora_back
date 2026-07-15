import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { PrismaService } from "src/core/database/prisma.service";
import { CreateUserData, StoreInfo, UpdateUserData, UserRepository } from "../interfaces/users.interfaces";
import { handleError } from "src/core/config/handleError";
import { users } from "@prisma/client";


@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: number): Promise<UserEntity | null> {
        try {
            const model = await this.prisma.users.findUnique({ where: { id } });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByLogin(login: string): Promise<UserEntity | null> {
        try {
            const model = await this.prisma.users.findUnique({
                where: { username: login },
            });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        try {
            const model = await this.prisma.users.findUnique({ where: { email } });
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByNumberTypeIdentity(id_identity_type: number, identity_number: string): Promise<UserEntity | null> {
        try {
            const model = await this.prisma.users.findFirst({ where: { identity_number, id_identity_type } });            
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async findByPassword(passwd: string): Promise<UserEntity | null> {
        try {
            const model = await this.prisma.users.findUnique({ where: { passwd } });            
            if (!model) return null;

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async create(data: CreateUserData): Promise<UserEntity> {
        try {
            const [{ id }] = await this.prisma.$queryRaw<[{ id: number }]>`
                SELECT nextval('public.users_id_seq')::int AS id
            `;

            const model = await this.prisma.users.create({
                data: {
                    id,
                    firts_names: data.first_names,
                    last_names: data.last_names,
                    email: data.email,
                    passwd: data.passwd,
                    phone_number: data.phone_number,
                    id_identity_type: data.id_identity_type,
                    identity_number: data.identity_number,
                    username: data.username,
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async updateActive(id: number, active: boolean): Promise<UserEntity> {
        try {
            const model = await this.prisma.users.update({
                where: { id },
                data: { active },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    async update(id: number, data: UpdateUserData): Promise<UserEntity> {
        try {
            const model = await this.prisma.users.update({
                where: { id },
                data: {
                    ...(data.first_names !== undefined && { firts_names: data.first_names }),
                    ...(data.last_names !== undefined && { last_names: data.last_names }),
                    ...(data.email !== undefined && { email: data.email }),
                    ...(data.username !== undefined && { username: data.username }),
                    ...(data.phone_number !== undefined && { phone_number: data.phone_number }),
                    ...(data.id_identity_type !== undefined && {
                        id_identity_type: data.id_identity_type,
                    }),
                    ...(data.identity_number !== undefined && {
                        identity_number: data.identity_number,
                    }),
                },
            });

            return this.mapToEntity(model);
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(model: users): UserEntity {
        return new UserEntity(
            model.id,
            model.firts_names,
            model.last_names,
            model.email,
            model.username,
            model.passwd,
            model.phone_number,
            model.id_identity_type,
            model.identity_number,
            model.active,
            model.created_at ?? new Date(),
        );
    }
}
