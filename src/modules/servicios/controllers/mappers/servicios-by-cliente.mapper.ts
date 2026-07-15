import { ServiciosByClienteEntity } from '../../entities/servicios-by-cliente.entity';
import { ResponseServiciosByClienteDto } from '../dto/out/responseserviciosbycliente.dto';

export class ServiciosByClienteMapper {
    static toResponseDto(entity: ServiciosByClienteEntity): ResponseServiciosByClienteDto {
        return {
            id_cliente: entity.id_cliente,
            nom_cliente: entity.nom_cliente,
            tipo_identificacion: entity.tipo_identificacion,
            numero_identificacion: entity.numero_identificacion,
            servicios: entity.servicios.map((servicio) => ({
                id_servicio: servicio.id_servicio,
                nom_servicio: servicio.nom_servicio,
                fecha_inicio: servicio.fecha_inicio,
                ultima_facturacion: servicio.ultima_facturacion,
                ultimo_pago: servicio.ultimo_pago,
                estado_servicio: servicio.estado_servicio,
            })),
        };
    }
}
