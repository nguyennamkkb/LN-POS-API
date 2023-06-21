import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { ProductEntity } from './entity/product.entity';
import {Common} from './../../helper/common/common'

@Injectable()
export class ProductService {

  constructor(@InjectRepository(ProductEntity) private repository: Repository<ProductEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[ProductEntity[],number]> {
        let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.name) {where['name'] = Like('%'+param.name+'%')} 
        if (param.status) {where['status'] = param.status} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }

    async findOne(_id: number): Promise<ProductEntity[]> {
        return await this.repository.find({
            where: [{ "id": _id }]
        });
    }
    async create(item: ProductEntity): Promise<ProductEntity>  {
        item.createAt = Date.now().toString()
        item.updateAt = Date.now().toString()
        return await this.repository.save(item)
    }
    async update(item: ProductEntity): Promise<UpdateResult> {
        item.updateAt = Date.now().toString()
        return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    

}
