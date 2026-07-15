export class MenuItemEntity {
    constructor(
        public readonly id_option: number,
        public readonly id_role: number,
        public readonly name_role: string,
        public readonly id_menu: number,
        public readonly id_pather_menu: number | null,
        public readonly name_menu: string,
        public readonly name_option: string,
        public readonly route_option: string,
        public readonly option_menu: number,
    ) { }
}
