export class ModeloIfcEntity {
  constructor(
    public readonly id: number,
    public readonly nombreArchivo: string,
    public readonly esquemaIfc: string,
    public readonly fechaProcesado: Date | null,
    public readonly aplicacionCreadora: string | null,
    public readonly totalesElementos: number | null,
  ) {}
}
