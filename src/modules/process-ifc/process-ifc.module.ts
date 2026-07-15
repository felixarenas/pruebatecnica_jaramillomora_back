import { Module } from '@nestjs/common';
import { AuthModule } from 'src/core/config/auth.module/auth.module';
import { ProcessIfcController } from './controllers/processifc/processifc.controller';
import { ProcessIfcService } from './services/processifc/processifc.service';

@Module({
  imports: [AuthModule],
  controllers: [ProcessIfcController],
  providers: [ProcessIfcService],
})
export class ProcessIfcModule {}
