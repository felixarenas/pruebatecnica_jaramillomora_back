import { TipoServicioEntity } from '../entities/tipo-servicio.entity';

export abstract class TipoServicioRepository {
    abstract findAll(): Promise<TipoServicioEntity[]>;
}
