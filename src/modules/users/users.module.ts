import { Module, forwardRef } from '@nestjs/common';
import { PrismaUserRepository } from './repositories/users.repository';
import { PrismaMenuRepository } from './repositories/menu.repository';
import { UserRepository } from './interfaces/users.interfaces';
import { MenuRepository } from './interfaces/menu.interfaces';
import { CreateUserService } from './services/createuser/createuser.service';
import { ActiveInactiveUserService } from './services/activeinactiveuser/activeinactiveuser.service';
import { FindUserService } from './services/finduser/finduser.service';
import { FindUserController } from './controllers/finduser/finduser.controller';
import { UpdateUsersController } from './controllers/update_users/update_users.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { UpdateUserService } from './services/updateuser/updateuser.service';
import { AuthModule } from 'src/core/config/auth.module/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ FindUserController, UpdateUsersController, AuthController],
  providers: [
    CreateUserService,
    ActiveInactiveUserService,
    UpdateUserService,
    FindUserService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: MenuRepository,
      useClass: PrismaMenuRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule { }
