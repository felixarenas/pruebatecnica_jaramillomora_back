import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from '../interfaces/users.interfaces';
import { LoginDto } from '../controllers/dto/int/login.dto';
import { IAuthResponse } from '../interfaces/auth.interface';
import { compareHash, generateHash } from 'src/core/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {

    const user = await this.userRepository.findByLogin(loginDto.login);
    if (!user) {

      throw new UnauthorizedException({message: 'Credenciales inválidas'});
    }

    if (!user.id) {
      throw new UnauthorizedException({message: 'Usuario inválido (sin ID)'});
    }
    
    if (!user.active) {
      throw new UnauthorizedException({message: 'Usuario inactivo'});
    }

    const isPasswordValid = await compareHash(loginDto.passwd, user.passwd);

    if (!isPasswordValid) {
      throw new UnauthorizedException({message: 'Credenciales inválidas'});
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    
    const response: IAuthResponse = {
      accessToken,
      user: {
        id: user.id,
        full_name: user.last_names ? `${user.first_names} ${user.last_names}` : user.first_names,
        email: user.email,
      }
    };

    return response
  }

  async validateToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }

}
