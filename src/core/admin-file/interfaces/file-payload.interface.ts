/**
 * Payload de archivo en base64 para persistencia en disco.
 */
export interface FilePayload {
  /** Nombre del archivo sin extensión */
  nom_file: string;
  /** Extensión del archivo (con o sin punto), p. ej. "ifc" o ".ifc" */
  ext: string;
  /** Tamaño declarado del archivo en bytes */
  size: number;
  /** Contenido del archivo codificado en base64 (con o sin prefijo data URI) */
  base64: string;
}

/**
 * Resultado de la creación del archivo en disco.
 */
export interface AdminFileCreateResult {
  /** Estado de la petición */
  status: boolean;
  /** Mensaje de la petición */
  message: string;
  /** Ruta absoluta del archivo creado */
  rutaCompleta: string;
  /** Nombre final del archivo (nom_file.ext) */
  nombreArchivo: string;
  /** Tamaño real en bytes del buffer escrito */
  sizeBytes: number;
  /** Extensión normalizada sin punto */
  ext: string;
}
