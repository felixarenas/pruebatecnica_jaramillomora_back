export class ElementoIfcEntity {
  constructor(
    public readonly id: number,
    public readonly modeloId: number | null,
    public readonly agrupacionId: number | null,
    public readonly globalId: string,
    public readonly tipoEntidadIfc: string,
    public readonly nombre: string | null,
    public readonly etiquetaId: string | null,
  ) {}
}
