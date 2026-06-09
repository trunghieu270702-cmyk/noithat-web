import { Module } from '@nestjs/common';
import { SeoPagesService } from './seo-pages.service';
import { SeoPagesController } from './seo-pages.controller';

@Module({
  controllers: [SeoPagesController],
  providers: [SeoPagesService],
})
export class SeoPagesModule {}
