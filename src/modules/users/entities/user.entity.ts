export class UserEntity {
    constructor(
        public readonly id: number,
        public readonly first_names: string,
        public readonly last_names: string,
        public readonly email: string,
        public readonly username: string,
        public readonly passwd: string,
        public readonly phone_number: string | null,
        public readonly id_identity_type: number,
        public readonly identity_number: string,
        public readonly active: boolean,
        public readonly created_at: Date,
    ) { }
}
