import { ApiProperty } from '@nestjs/swagger';

export class ResponseMeRoleDto {
    @ApiProperty({ description: 'Identificador del rol', example: 1 })
    id_role!: number;

    @ApiProperty({ description: 'Nombre del rol', example: 'admin' })
    name_role!: string;
}

export class ResponseMeStoreDto {
    @ApiProperty({ description: 'Identificador de la tienda', example: 1 })
    id_store!: number;

    @ApiProperty({ description: 'Nombre de la tienda', example: 'tienda 1' })
    name_store!: string;
}

export class ResponseMeMenuOptionDto {
    @ApiProperty({ description: 'Identificador de la opción de menú', example: 1 })
    id_option!: number;

    @ApiProperty({ description: 'Identificador del rol asociado', example: 1 })
    id_role!: number;

    @ApiProperty({ description: 'Nombre del rol asociado', example: 'admin' })
    name_role!: string;

    @ApiProperty({ description: 'Nombre de la opción', example: 'Facturación' })
    name_option!: string;

    @ApiProperty({ description: 'Ruta de la opción', example: '/billing' })
    route_option!: string;
}

export class ResponseMeMenuDto {
    @ApiProperty({ description: 'Identificador del menú', example: 1 })
    id_menu!: number;

    @ApiProperty({ description: 'Identificador del menú padre', example: null, nullable: true })
    id_pather_menu!: number | null;

    @ApiProperty({ description: 'Nombre del menú', example: 'Ventas' })
    name_menu!: string;

    @ApiProperty({ description: 'Opciones del menú', type: [ResponseMeMenuOptionDto] })
    options!: ResponseMeMenuOptionDto[];

    @ApiProperty({ description: 'Submenús', type: () => [ResponseMeMenuDto] })
    children!: ResponseMeMenuDto[];
}

export class ResponseMeOperationActionDto {
    @ApiProperty({ description: 'Identificador de la operación', example: 1 })
    id!: number;

    @ApiProperty({ description: 'Nombre de la operación', example: 'CREATE' })
    operation!: string;
}

export class ResponseMeOperationDto {
    @ApiProperty({ description: 'Identificador del rol', example: 1 })
    id_role!: number;

    @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
    name_role!: string;

    @ApiProperty({ description: 'Identificador de la opción de menú', example: 1 })
    id_option!: number;

    @ApiProperty({ description: 'Nombre de la opción de menú', example: 'CREAR USUARIO' })
    option_name!: string;

    @ApiProperty({ description: 'Ruta de la opción de menú', example: '/users/create' })
    route_option!: string;

    @ApiProperty({ description: 'Operaciones permitidas', type: [ResponseMeOperationActionDto] })
    operation!: ResponseMeOperationActionDto[];
}

export class ResponseMeDto {
    @ApiProperty({ description: 'Nombres del usuario', example: 'Juan' })
    first_names!: string;

    @ApiProperty({ description: 'Apellidos del usuario', example: 'Perez' })
    last_names!: string;

    @ApiProperty({ description: 'Correo del usuario', example: 'correpruebas@correo.com.co' })
    email!: string;

    @ApiProperty({ description: 'Identificador del rol principal', example: 1 })
    id_role!: number;

    @ApiProperty({ description: 'Nombre del rol principal', example: 'role admin' })
    name_role!: string;

    @ApiProperty({ description: 'Estado activo del usuario', example: true })
    active!: boolean;

    @ApiProperty({ description: 'Número de teléfono', example: '3250000000' })
    phone_number!: string;

    @ApiProperty({ description: 'Tipo de documento', example: 1 })
    id_identity_type!: number;

    @ApiProperty({ description: 'Número de documento', example: '123456789' })
    identity_number!: string;

    @ApiProperty({ description: 'Roles del usuario en la tienda', type: [ResponseMeRoleDto] })
    roles!: ResponseMeRoleDto[];

    @ApiProperty({ description: 'Tiendas asociadas al usuario', type: [ResponseMeStoreDto] })
    stores!: ResponseMeStoreDto[];

    @ApiProperty({ description: 'Menú dinámico del usuario', type: [ResponseMeMenuDto] })
    menu!: ResponseMeMenuDto[];

    @ApiProperty({ description: 'Operaciones permitidas por rol y opción de menú', type: [ResponseMeOperationDto] })
    operations!: ResponseMeOperationDto[];
}
