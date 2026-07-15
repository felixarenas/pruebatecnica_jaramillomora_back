import { ApiProperty } from '@nestjs/swagger';
import { ResponseCreateUserDto } from './responsecreateuser.dto';

export class ResponseUserByStoreDto extends ResponseCreateUserDto {
    @ApiProperty({
        description: 'Nombre de usuario para inicio de sesión',
        example: 'jperez',
    })
    username!: string;
}
