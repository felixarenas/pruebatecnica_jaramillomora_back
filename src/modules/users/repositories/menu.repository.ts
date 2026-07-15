import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { handleError } from 'src/core/config/handleError';
import { MenuItemEntity } from '../entities/menu-item.entity';
import { OperationRoleItemEntity } from '../entities/operation-role-item.entity';
import { MenuRepository } from '../interfaces/menu.interfaces';

type GetMenuRow = {
    id_option: number;
    id_role: number;
    name_role: string;
    id_menu: number;
    id_pather_menu: number | null;
    name_menu: string;
    name_option: string;
    route_option: string;
    option_menu: number;
};

type GetOperationsRolesRow = {
    id_operation: number;
    name_operation: string;
    id_role: number;
    name_role: string;
    id_option_menu: number;
    name_option_menu: string;
    route_option_menu: string;
};

@Injectable()
export class PrismaMenuRepository implements MenuRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getMenu(idUser: number, idStore: number): Promise<MenuItemEntity[]> {
        try {
            const rows = await this.prisma.$queryRaw<GetMenuRow[]>`
                SELECT * FROM auth.get_menu(${idUser}::integer, ${idStore}::integer)
            `;

            return rows.map((row) => this.mapToEntity(row));
        } catch (error) {
            throw handleError(error);
        }
    }

    async getOperationByUser(idUser: number, idStore: number): Promise<OperationRoleItemEntity[]> {
        try {
            const rows = await this.prisma.$queryRaw<GetOperationsRolesRow[]>`
                SELECT * FROM auth.get_operations_roles(${idUser}::integer, ${idStore}::integer)
            `;

            return rows.map((row) => this.mapToOperationEntity(row));
        } catch (error) {
            throw handleError(error);
        }
    }

    private mapToEntity(row: GetMenuRow): MenuItemEntity {
        return new MenuItemEntity(
            row.id_option,
            row.id_role,
            row.name_role,
            row.id_menu,
            row.id_pather_menu,
            row.name_menu,
            row.name_option,
            row.route_option,
            row.option_menu,
        );
    }

    private mapToOperationEntity(row: GetOperationsRolesRow): OperationRoleItemEntity {
        return new OperationRoleItemEntity(
            row.id_operation,
            row.name_operation,
            row.id_role,
            row.name_role,
            row.id_option_menu,
            row.name_option_menu,
            row.route_option_menu,
        );
    }
}
