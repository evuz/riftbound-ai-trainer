import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getStatus() {
    return {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}