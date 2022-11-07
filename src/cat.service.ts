import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat, Document } from './cat.schema';

@Injectable()
export class CatService {
  constructor(@InjectModel(Cat.name) private catModel: Model<Document>) {}

  async create(cat: Cat): Promise<Cat> {
    const newCat = new this.catModel(cat);
    return newCat.save();
  }

  async findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  async findById(id): Promise<Cat> {
    return this.catModel.findById(id).exec();
  }

  async update(id, cat: Cat): Promise<Cat> {
    return this.catModel.findByIdAndUpdate(id, cat).exec();
  }

  async delete(id): Promise<any> {
    return this.catModel.findByIdAndRemove(id).exec();
  }
}
