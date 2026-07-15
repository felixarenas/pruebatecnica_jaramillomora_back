export class ServicioByClienteItemEntity {
    constructor(
        public readonly id_servicio: number,
        public readonly nom_servicio: string,
        public readonly fecha_inicio: Date,
        public readonly ultima_facturacion: Date,
        public readonly ultimo_pago: number,
        public readonly estado_servicio: boolean,
    ) { }
}

export class ServiciosByClienteEntity {
    constructor(
        public readonly id_cliente: number,
        public readonly nom_cliente: string,
        public readonly tipo_identificacion: string,
        public readonly numero_identificacion: number,
        public readonly servicios: ServicioByClienteItemEntity[],
    ) { }
}
