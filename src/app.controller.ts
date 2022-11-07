import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AppService } from './app.service';
import { SERVICE_NAME } from './config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(SERVICE_NAME) private readonly client: ClientProxy,
  ) {}
}
