import { UserEntity } from "../entities/user.entity";

export type CreateUserData = Omit<UserEntity, 'id' | 'created_at' | 'active' | 'id_role'> & {
    id_role?: number;
};

export type StoreInfo = {
    id: number;
    name: string;
};

export type UpdateUserData = {
    first_names?: string;
    last_names?: string;
    email?: string;
    username?: string;
    phone_number?: string;
    id_identity_type?: number;
    identity_number?: string;
    id_role?: number;
};

export abstract class UserRepository {
    abstract findById(id: number): Promise<UserEntity | null>;
    abstract findByLogin(login: string): Promise<UserEntity | null>;
    abstract findByEmail(email: string): Promise<UserEntity | null>;
    abstract findByNumberTypeIdentity(id_identity_type: number, identity_number: string): Promise<UserEntity | null>;
    abstract findByPassword(passwd: string): Promise<UserEntity | null>;
    abstract create(data: CreateUserData): Promise<UserEntity>;
    abstract updateActive(id: number, active: boolean): Promise<UserEntity>;
    abstract update(id: number, data: UpdateUserData): Promise<UserEntity>;
}
