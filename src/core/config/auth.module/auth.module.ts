import { Global, Module, forwardRef } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { AuthService } from 'src/modules/users/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../envs';
import { UsersModule } from 'src/modules/users/users.module';

@Global()
@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: envs.SECRECT_KEY || 'super-secret-key-123',
            signOptions: { expiresIn: envs.DURATION_TOKEN as any },
        }),
        forwardRef(() => UsersModule),
    ],
    providers: [
        AuthService,
        JwtAuthGuard,
    ],
    exports: [
        AuthService,
        JwtAuthGuard,
        JwtModule,
    ],
})
export class AuthModule { }
