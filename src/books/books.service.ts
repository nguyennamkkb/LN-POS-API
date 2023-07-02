import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan, Between } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { BooksEntity } from './entity/books.entity';
import {Common} from './../../helper/common/common'

@Injectable()
export class BooksService {

  constructor(@InjectRepository(BooksEntity) private repository: Repository<BooksEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[BooksEntity[],number]> {
        let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.idCustomer) {where['idCustomer'] = param.idCustomer} 
        if (param.idEmployee) {where['idEmployee'] = param.idEmployee} 
        if (param.from && param.to) {where['start'] = Between[param.from, param.to]} 
        if (param.status) {where['status'] = param.status} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            relations:{
                employee: true,
                customer: true
            }
        });
        return [res, totalCount];
    }

    async findOne(id: number): Promise<BooksEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }
    async create(item: BooksEntity): Promise<BooksEntity>  {
        item.createAt = Date.now().toString()
        item.updateAt = Date.now().toString()
        return await this.repository.save(item)
    }
    async update(item: BooksEntity): Promise<UpdateResult> {
        item.updateAt = Date.now().toString()
        return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    

}
