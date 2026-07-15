export const ENUM_DRIVER_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    LICENCIA_VENCIDA: 'licencia_vencida',
} as const;
export type ENUM_DRIVER_STATUS = typeof ENUM_DRIVER_STATUS[keyof typeof ENUM_DRIVER_STATUS];

export const ENUM_VEHICLE_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    MANTENIMIENTO: 'mantenimiento',
} as const;
export type ENUM_VEHICLE_STATUS = typeof ENUM_VEHICLE_STATUS[keyof typeof ENUM_VEHICLE_STATUS];

export const ENUM_FLEET_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
} as const;
export type ENUM_FLEET_STATUS = typeof ENUM_FLEET_STATUS[keyof typeof ENUM_FLEET_STATUS];

export const ENUM_FLEET_TYPE = {
    URBANA: 'urbana',
    SUBURBANA: 'suburbana',
    INTERMUNICIPAL: 'intermunicipal',
} as const;
export type ENUM_FLEET_TYPE = typeof ENUM_FLEET_TYPE[keyof typeof ENUM_FLEET_TYPE];

export const ENUM_ASSIGNMENT_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
} as const;
export type ENUM_ASSIGNMENT_STATUS = typeof ENUM_ASSIGNMENT_STATUS[keyof typeof ENUM_ASSIGNMENT_STATUS];

export const ENUM_EVENT_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
} as const;
export type ENUM_EVENT_STATUS = typeof ENUM_EVENT_STATUS[keyof typeof ENUM_EVENT_STATUS];

export const ENUM_EVENT_TYPE = {
    VELOCIDAD: 'velocidad',
    DESVIO: 'desvio',
    PARADA: 'parada',
    ACELERACION: 'aceleracion',
    FRENADO: 'frenado',
    GIRO: 'giro',
    BATERIA_BAJA: 'bateria_baja',
    CONEXION_PERDIDA: 'conexion_perdida',
    CONEXION_RESTABLECIDA: 'conexion_restablecida',
} as const;
export type ENUM_EVENT_TYPE = typeof ENUM_EVENT_TYPE[keyof typeof ENUM_EVENT_TYPE];

export const EMAIL_ADDRESS = "correpruebas@correo.com.co"
export const PHONE_NUMBER = "3106543210"

export const ENUM_USER_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
} as const;
export type ENUM_USER_STATUS = typeof ENUM_USER_STATUS[keyof typeof ENUM_USER_STATUS];

export const ENUM_TOKEN_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
} as const;
export type ENUM_TOKEN_STATUS = typeof ENUM_TOKEN_STATUS[keyof typeof ENUM_TOKEN_STATUS];
