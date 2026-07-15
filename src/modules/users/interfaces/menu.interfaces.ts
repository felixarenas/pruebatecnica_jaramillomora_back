import { MenuItemEntity } from '../entities/menu-item.entity';
import { OperationRoleItemEntity } from '../entities/operation-role-item.entity';

export abstract class MenuRepository {
    abstract getMenu(idUser: number, idStore: number): Promise<MenuItemEntity[]>;

    abstract getOperationByUser(idUser: number, idStore: number): Promise<OperationRoleItemEntity[]>;
}
