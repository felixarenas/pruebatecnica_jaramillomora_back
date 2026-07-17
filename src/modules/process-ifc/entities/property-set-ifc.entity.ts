export class PropertySetIfcEntity {
  constructor(
    public readonly id: number,
    public readonly elementoId: number | null,
    public readonly nombrePset: string,
  ) {}
}
