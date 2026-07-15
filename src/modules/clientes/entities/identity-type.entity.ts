export class IdentityTypeEntity {
    constructor(
        public readonly id: number,
        public readonly abr: string,
        public readonly name: string,
        public readonly dian_code: string | null,
        public readonly description: string | null,
    ) { }
}
