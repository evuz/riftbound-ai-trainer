import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './presentation/api/health/health.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule],
})
export class AppModule {}