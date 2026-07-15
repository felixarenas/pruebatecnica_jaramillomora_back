import { Module, Global } from "@nestjs/common";
import { PrismaService } from "src/core/database/prisma.service";


@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }