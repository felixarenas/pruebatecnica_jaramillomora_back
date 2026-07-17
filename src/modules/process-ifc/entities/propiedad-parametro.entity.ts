export class PropiedadParametroEntity {
  constructor(
    public readonly id: number,
    public readonly psetId: number | null,
    public readonly nombrePropiedad: string,
    public readonly valor: string | null,
    public readonly tipoValor: string | null,
  ) {}
}
