import { Injectable } from '@nestjs/common';
import { TipoServicioEntity } from '../../entities/tipo-servicio.entity';
import { TipoServicioRepository } from '../../interfaces/tipo-servicio.interfaces';

@Injectable()
export class GetTiposServicioService {
    constructor(private readonly tipoServicioRepository: TipoServicioRepository) { }

    async getAll(): Promise<TipoServicioEntity[]> {
        return this.tipoServicioRepository.findAll();
    }
}
