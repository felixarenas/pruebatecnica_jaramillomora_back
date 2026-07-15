export class ServicioEntity {
    constructor(
        public readonly id: number,
        public readonly id_cliente: number,
        public readonly id_tipo_servicio: number,
        public readonly fecha_inicio: Date,
        public readonly ultima_facturacion: Date,
        public readonly ultimo_pago: number,
        public readonly estado: boolean,
    ) { }
}
