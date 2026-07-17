import { PropiedadParametroEntity } from '../entities/propiedad-parametro.entity';

export type CreatePropiedadParametroData = {
  pset_id: number;
  nombre_propiedad: string;
  valor: string | null;
  tipo_valor: string | null;
};

export abstract class PropiedadParametroRepository {
  abstract create(
    data: CreatePropiedadParametroData[],
  ): Promise<PropiedadParametroEntity[]>;
  abstract findById(id: number): Promise<PropiedadParametroEntity | null>;
  abstract findByPsetId(psetId: number): Promise<PropiedadParametroEntity[]>;
}
