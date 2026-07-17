export class CantidadIfcEntity {
  constructor(
    public readonly id: number,
    public readonly elementoId: number | null,
    public readonly nombreCantidad: string,
    public readonly valor: number,
    public readonly unidad: string | null,
  ) {}
}
