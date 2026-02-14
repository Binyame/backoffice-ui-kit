import { Module } from '@nestjs/common';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [OwnersModule],
})
export class AppModule {}
