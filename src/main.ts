import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: ['nats://localhost:4222'],
      queue: 'cats_queue',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.NATS,
  //     options: {
  //       servers: ['nats://localhost:4222'],
  //       // queue: 'cats_queue',
  //     },
  //   },
  // );

  // app.listen();
}

bootstrap();
