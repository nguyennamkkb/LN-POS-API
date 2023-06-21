import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { EmployeeEntity } from './entity/employee.entity';
import {Common} from './../../helper/common/common'

@Injectable()
export class EmployeeService {

  constructor(@InjectRepository(EmployeeEntity) private repository: Repository<EmployeeEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[EmployeeEntity[],number]> {
        var where = {keySearch: Like('%%')}
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

    async findOne(_id: number): Promise<EmployeeEntity[]> {
        return await this.repository.find({
            where: [{ "id": _id }]
        });
    }
    async create(item: EmployeeEntity): Promise<EmployeeEntity>  {
        item.createAt = Date.now().toString()
        item.updateAt = Date.now().toString()
        return await this.repository.save(item)
    }
    async update(item: EmployeeEntity): Promise<UpdateResult> {
        item.updateAt = Date.now().toString()
        return await this.repository.update(item.id, item)
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    

}
