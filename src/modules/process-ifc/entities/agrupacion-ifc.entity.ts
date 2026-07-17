export class AgrupacionIfcEntity {
  constructor(
    public readonly id: number,
    public readonly modeloId: number | null,
    public readonly tipoAgrupacion: string,
    public readonly nombre: string,
    public readonly globalIdIfc: string | null,
  ) {}
}
