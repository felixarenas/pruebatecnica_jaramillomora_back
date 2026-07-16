import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/config/auth.module/auth.module';
import { ProcessIfcController } from './controllers/processifc/processifc.controller';
import { ProcessIfcRepository } from './interfaces/processifc.interfaces';
import { PrismaProcessIfcRepository } from './repositories/processifc.repository';
import { GetFileIfcAllService } from './services/getfileifcall/getfileifcall.service';
import { ProcessIfcService } from './services/processifc/processifc.service';

@Module({
  imports: [AuthModule],
  controllers: [ProcessIfcController],
  providers: [
    ProcessIfcService,
    GetFileIfcAllService,
    {
      provide: ProcessIfcRepository,
      useClass: PrismaProcessIfcRepository,
    },
  ],
  exports: [ProcessIfcRepository],
})
export class ProcessIfcModule {}
