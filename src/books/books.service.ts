import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository, Like, LessThan, MoreThan, Between, In } from 'typeorm';
import { UpdateResult, DeleteResult } from  'typeorm';
import { BooksEntity } from './entity/books.entity';
import {Common} from './../../helper/common/common'
import e from 'express';

@Injectable()
export class BooksService {

  constructor(@InjectRepository(BooksEntity) private repository: Repository<BooksEntity>) { }

    async findAll(page: number, limit: number, param: any): Promise<[BooksEntity[],number]> {
        try {
            let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.idCustomer) {where['idCustomer'] = param.idCustomer} 
        if (param.idEmployee) {where['idEmployee'] = param.idEmployee} 
        if (param.from && param.to) {where['start'] = Between(Number(param.from), Number(param.to))} 
        if (param.status) {where['status'] = param.status} 

        // console.log(where)
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            relations:{
                employee: true,
                customer: true
            },
            order: {
                start: "ASC"
            }
            
        });
        return [res, totalCount];
        } catch (error) {
            console.log(error)
        }
        
    }
    async findAll2(page: number, limit: number, param: any): Promise<[BooksEntity[],number]> {
        try {
            let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.idCustomer) {where['idCustomer'] = param.idCustomer} 
        if (param.idEmployee) {where['idEmployee'] = param.idEmployee} 
        if (param.from && param.to) {where['start'] = Between(Number(param.from), Number(param.to))} 
        if (param.status) {where['status'] = param.status} 

        // console.log(where)
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            relations:{
                employee: true,
                customer: true
            },
            order: {
                start: "DESC"
            }
            
        });
        return [res, totalCount];
        } catch (error) {
            console.log(error)
        }
        
    }
    async getAllBookInSuccess(page: number, limit: number, param: any): Promise<[BooksEntity[],number]> {
        let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        where['status'] = In([0,2,3,4])

        // console.log(where)
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            relations:{
                employee: true,
                customer: true
            },
            order: {
                start: "ASC"
            }
            
        });
        return [res, totalCount];
    }
    async getAllBookDangPhucVu(page: number, limit: number, param: any): Promise<[BooksEntity[],number]> {
        let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        where['status'] = In([2,3,4])

        // console.log(where)
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            where: where,
            skip,
            take: limit,
            relations:{
                employee: true,
                customer: true
            },
            order: {
                start: "ASC"
            }
            
        });
        return [res, totalCount];
    }
    async getAllBooks(param: any): Promise<BooksEntity[]> {
        let where = {}
        if (param.store_id) {where['store_id'] = param.store_id} 
        if (param.from && param.to) {where['start'] = Between(Number(param.from), Number(param.to))} 
        if (param.status) {where['status'] = param.status} 

        // console.log(where)
        const res = await this.repository.find({
            where: where,
            order: {
                start: "ASC"
            }
            
        });
        return res;
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
    async layTongDoanhThuNhanVien(store_id: number, employee_id: number): Promise<any> {
        // dang chon mon
        // const item = await this.repository.findOne({ where: { "id": id } });
        // item.updateAt = Date.now()
    
    
        const sqlString =
          "Select sum(amount) as tongtien from books_entity where store_id = "+store_id+" and status = 1 and idEmployee = "+employee_id+";";
        //   console.log(sqlString)
        try {
            const res = await this.repository.query(sqlString)
           
          return await res[0]['tongtien'];
        } catch (error) {
        //   log("er" + error);
          return error;
        }
        // return await this.repository.update(item.id, item)
      }
      async layTongLuotLamKhachHang(store_id: number, customer_id: number): Promise<any> {
        // dang chon mon
        // const item = await this.repository.findOne({ where: { "id": id } });
        // item.updateAt = Date.now()
    
    
        const sqlString =
          "Select count(*) as tong from books_entity where store_id = "+store_id+" and status = 1 and idCustomer = "+customer_id+";";
        //   console.log(sqlString)
        try {
            const res = await this.repository.query(sqlString)
           
          return await res[0]['tong'];
        } catch (error) {
        //   log("er" + error);
          return error;
        }
        // return await this.repository.update(item.id, item)
      }

}
