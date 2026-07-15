export class OperationRoleItemEntity {
    constructor(
        public readonly id_operation: number,
        public readonly name_operation: string,
        public readonly id_role: number,
        public readonly name_role: string,
        public readonly id_option_menu: number,
        public readonly name_option_menu: string,
        public readonly route_option_menu: string,
    ) { }
}
