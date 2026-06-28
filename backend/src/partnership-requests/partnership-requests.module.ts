import { Module } from '@nestjs/common';
import { PartnershipRequestsService } from './partnership-requests.service';
import { PartnershipRequestsController } from './partnership-requests.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PartnershipRequestsController],
  providers: [PartnershipRequestsService],
})
export class PartnershipRequestsModule {}
