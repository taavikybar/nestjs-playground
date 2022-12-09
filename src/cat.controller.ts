import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  MessagePattern,
  ClientProxy,
  Payload,
  EventPattern,
} from '@nestjs/microservices';
import { CatService } from './cat.service';
import { Cat } from './cat.schema';
import { firstValueFrom } from 'rxjs';
import { SERVICE_NAME } from './config';

@Controller('cats')
export class CatController {
  constructor(
    private readonly catService: CatService,
    @Inject(SERVICE_NAME) private readonly client: ClientProxy,
  ) {}

  /* NATS request-response */
  @MessagePattern({ cmd: 'get-all' })
  getAll() {
    return this.catService.findAll();
  }

  @MessagePattern({ cmd: 'get-by-id' })
  getById(@Payload() id: string) {
    return this.catService.findById(id);
  }

  @MessagePattern({ cmd: 'create' })
  create(cat: Cat) {
    return this.catService.create(cat);
  }

  @MessagePattern({ cmd: 'update' })
  update({ id, cat }) {
    return this.catService.update(id, cat);
  }

  @MessagePattern({ cmd: 'delete' })
  delete(id: string) {
    return this.catService.delete(id);
  }

  /* NATS event based */
  @EventPattern('cat-created')
  async handleCatCreated(@Payload() cat: Cat) {
    const newCat = await this.catService.create(cat);
    console.log('cat-created event', newCat);
  }

  /* HTTP */
  @Get('/:id')
  async findById(@Res() response, @Param('id') id) {
    const cat = await this.catService.findById(id);
    return response.status(HttpStatus.OK).json({
      cat,
    });
  }

  @Post()
  async createCat(@Res() response, @Body() cat: Cat) {
    const newCat = await this.catService.create(cat);
    return response.status(HttpStatus.CREATED).json({
      newCat,
    });
  }

  @Post('/event')
  async createCatEvent(@Res() response, @Body() cat: Cat) {
    // proxying message via nats to eventhandler
    this.client.emit('cat-created', cat);

    return response.status(HttpStatus.CREATED).json({
      catCreated: true,
    });
  }

  @Get()
  async findAllHttp(@Res() response) {
    // proxying message via nats to messagehandler
    const msg = this.client.send({ cmd: 'get-all' }, '');
    const cats = await firstValueFrom(msg);

    // using service
    // const cats = await this.catService.findAll();

    return response.status(HttpStatus.OK).json({
      cats,
    });
  }

  @Put('/:id')
  async updateHttp(@Res() response, @Param('id') id, @Body() cat: Cat) {
    const updatedCat = await this.catService.update(id, cat);
    return response.status(HttpStatus.OK).json({
      updatedCat,
    });
  }

  @Delete('/:id')
  async deleteHttp(@Res() response, @Param('id') id) {
    const deletedCat = await this.catService.delete(id);
    return response.status(HttpStatus.OK).json({
      deletedCat,
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Nats connected!');
  }
}
