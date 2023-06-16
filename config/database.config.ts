import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    // password: 'pos-api.1A',
    database: 'lnproduct_db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
};