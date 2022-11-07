import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatService } from './cat.service';
import { CatController } from './cat.controller';
import { Cat, CatSchema } from './cat.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SERVICE_NAME } from './config';

const dbURI = 'mongodb://localhost:27017/admin';

const NatsClientProvider: Provider = {
  inject: [ConfigService],
  provide: SERVICE_NAME,
  useFactory: async () =>
    ClientProxyFactory.create({
      options: {
        servers: ['nats://localhost:4222'],
      },
      transport: Transport.NATS,
    }),
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(dbURI),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
  controllers: [AppController, CatController],
  providers: [AppService, CatService, NatsClientProvider],
})
export class AppModule {}
