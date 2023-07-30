import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private repository: Repository<UserEntity>) { }

    async findAll(page: number, limit: number): Promise<[UserEntity[], number]> {
        const skip = (page - 1) * limit;
        const [res, totalCount] = await this.repository.findAndCount({
            skip,
            take: limit,
        });

        return [res, totalCount];
    }

    async findOneByPhonePassword(phone: string, password: string): Promise<UserEntity | null> {
        const res = await this.repository.findOne({ where: { "phone": phone, "password": password } });
        return res ? res : null;
    }
    async findOne(id: number): Promise<UserEntity | null> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }
    async create(item: UserEntity): Promise<UserEntity> {
        item.createAt = Date.now()
        item.updateAt = Date.now()
        return await this.repository.save(item)
    }
    async update(item: UserEntity): Promise<UpdateResult> {
        try {
            item.updateAt = Date.now()
        return await this.repository.update(item.id, item)
        } catch (error) {
            // console.log(error)
        }
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }
    async findPhonePassword(phone: string, password: string): Promise<UserEntity | null> {
        // return await this.repository.find({
        //     where: [{ "phone": phone, "password": password }]
        // });

        const res = await this.repository.findOne({ where: [{ "phone": phone, "password": password }] });
        return res ? res : null;
    }
    async findByPhone(phone: string): Promise<UserEntity| null> {
        const res = await this.repository.findOne({ where: { "phone": phone } });
        return res ? res : null;
    }

    async findById(id: number): Promise<UserEntity | null> {
        const res = await this.repository.findOne({ where: { "id": id } });
        return res ? res : null;
    }


}
