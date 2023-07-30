import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { CustomerEntity } from './entity/customer.entity';
import {Common} from './../../helper/common/common'

@Injectable()
export class CustomerService {

  constructor(@InjectRepository(CustomerEntity) private repository: Repository<CustomerEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[CustomerEntity[],number]> {
        var where = {fullName: Like('%%')}
        if (param.fullName) {where['fullName'] = Like('%'+param.fullName+'%')} 
        if (param.status) { where['status'] = param.status }
        if (param.phone) {where['phone'] = Like('%'+param.phone+'%')} 
        if (param.address) {where['address'] = Like('%'+param.address+'%')} 
        if (param.gender) {where['gender'] = param.gender}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.keySearch) {where['keySearch'] = Like('%'+param.keySearch+'%')} 
        if (param.from) {where['createAt'] = MoreThan(param.from)} 
        if (param.to) {where['createAt'] = LessThan(param.to)} 
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where:where,
            skip,
            take: limit,
        });
        return [res, totalCount];
    }

    async findOne(id: number): Promise<CustomerEntity> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }
    async create(item: CustomerEntity): Promise<CustomerEntity>  {
        item.createAt = Date.now().toString()
        item.updateAt = Date.now().toString()
        return await this.repository.save(item)
    }
    async update(item: CustomerEntity): Promise<UpdateResult> {
        item.updateAt = Date.now().toString()
        return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }
    async findByPhone(phone: string): Promise<CustomerEntity| null> {
        const res = await this.repository.findOne({ where: { "phone": phone } });
        return res ? res : null;
    }

    

}
