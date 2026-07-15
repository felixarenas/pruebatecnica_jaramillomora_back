export class ClienteEntity {
    constructor(
        public readonly id: number,
        public readonly id_tipo_identificacion: number,
        public readonly identificacion: number,
        public readonly nombres: string,
        public readonly apellidos: string,
        public readonly fecha_nacimiento: Date,
        public readonly numero_celular: string,
        public readonly email: string,
        public readonly estado: boolean,
    ) { }
}
